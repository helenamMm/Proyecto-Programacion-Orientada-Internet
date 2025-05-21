// hooks/useVideoCall.js
import { useRef, useState } from 'react';
import { db } from '../firebase/firebase';
import {
  doc,
  setDoc,
  collection,
  addDoc,
  getDoc,
  onSnapshot,
} from 'firebase/firestore';

const servers = {
  iceServers: [
    { 
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'] 
    },
    
  ],
  iceCandidatePoolSize: 10,
};

export default function useVideoCall() {
  const pc = useRef(new RTCPeerConnection(servers));
  const localStream = useRef(null);
  const remoteStream = useRef(new MediaStream());

  const webcamVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [callId, setCallId] = useState('');

  const startWebcam = async () => {
    localStream.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

    localStream.current.getTracks().forEach((track) => {
      pc.current.addTrack(track, localStream.current);
    });

    pc.current.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.current.addTrack(track);
      });
    };

    if (webcamVideoRef.current) webcamVideoRef.current.srcObject = localStream.current;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream.current;
  };

  const createCall = async () => {
    const callDoc = doc(collection(db, 'calls'));
    const offerCandidates = collection(callDoc, 'offerCandidates');
    const answerCandidates = collection(callDoc, 'answerCandidates');

    setCallId(callDoc.id);

    pc.current.onicecandidate = async (event) => {
      if (event.candidate) {
        await addDoc(offerCandidates, event.candidate.toJSON());
      }
    };

    const offerDescription = await pc.current.createOffer();
    await pc.current.setLocalDescription(offerDescription);

    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };

    await setDoc(callDoc, { offer });

    onSnapshot(callDoc, (snapshot) => {
      const data = snapshot.data();
      if (!pc.current.currentRemoteDescription && data?.answer) {
        pc.current.setRemoteDescription(new RTCSessionDescription(data.answer));
      }
    });

    onSnapshot(answerCandidates, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          pc.current.addIceCandidate(new RTCIceCandidate(change.doc.data()));
        }
      });
    });

    return callDoc.id;
  };

  const answerCall = async (id) => {
    const callDoc = doc(db, 'calls', id);
    const answerCandidates = collection(callDoc, 'answerCandidates');
    const offerCandidates = collection(callDoc, 'offerCandidates');

    pc.current.onicecandidate = async (event) => {
      if (event.candidate) {
        await addDoc(answerCandidates, event.candidate.toJSON());
      }
    };

    const callData = (await getDoc(callDoc)).data();
    const offerDescription = callData.offer;
    await pc.current.setRemoteDescription(new RTCSessionDescription(offerDescription));

    // Only set remote description if it's not already set
    if (!pc.current.currentRemoteDescription) {
    await pc.current.setRemoteDescription(new RTCSessionDescription(offerDescription));
    }

// Only answer if signaling state is correct
    if (pc.current.signalingState !== 'have-remote-offer') {
    console.warn('Skipping createAnswer: not in "have-remote-offer" state');
    return;
  } 
    const answerDescription = await pc.current.createAnswer();
    await pc.current.setLocalDescription(answerDescription);

    const answer = {
      type: answerDescription.type,
      sdp: answerDescription.sdp,
    };

    await setDoc(callDoc, { ...callData, answer });

    onSnapshot(offerCandidates, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          pc.current.addIceCandidate(new RTCIceCandidate(change.doc.data()));
        }
      });
    });
  };

  const hangUp = () => {
    pc.current.close();
    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => track.stop());
    }
    if (webcamVideoRef.current) webcamVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
  };

  return {
    startWebcam,
    createCall,
    answerCall,
    hangUp,
    webcamVideoRef,
    remoteVideoRef,
    callId,
  };
}