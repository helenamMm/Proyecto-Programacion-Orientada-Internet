import React, { useRef, useEffect, useState } from "react";
import './ChatModal.css';
import { db } from "../firebase/firebase";
import {
  collection,
  doc,
  setDoc,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  getDoc,
} from "firebase/firestore";

function ChatModal({ isOpen, onClose, contact }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const username = localStorage.getItem("username");

  const chatId = [username, contact].sort().join("_"); // nombre único del chat
  const chatRef = doc(db, "chats", chatId);
  const messagesRef = collection(chatRef, "mensajes");

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pc = useRef(null);

  const [isCalling, setIsCalling] = useState(false);

  //const callRef = collection(chatRef, "call"); // Firestore path for signaling

  const servers = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  const setupPeerConnection = async (isCaller) => {
    pc.current = new RTCPeerConnection(servers);
  
    // Get user media
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localVideoRef.current.srcObject = stream;
      stream.getTracks().forEach(track => pc.current.addTrack(track, stream));
    } catch (error) {
      console.error("Error accessing media devices:", error);
      alert("Unable to access your camera or microphone.");
    }
    
  
    // Display remote stream
    pc.current.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };
  
    // ICE candidate sending
    pc.current.onicecandidate = async (event) => {
      if (event.candidate) {
        await addDoc(callRef, {
          type: "ice",
          candidate: event.candidate.toJSON(),
          sender: username,
          receiver: contact
        });
      }
    };
  
    return pc.current;
  };
  
  const handleCall = async () => {
    const pcInstance = await setupPeerConnection(true);
    setIsCalling(true);
  
    const offer = await pcInstance.createOffer();
    await pcInstance.setLocalDescription(offer);
  
    await addDoc(callRef, {
      type: "offer",
      offer,
      sender: username,
      receiver: contact
    });
  };
  

  const callRef = collection(chatRef, "call");

  useEffect(() => {
    const unsubscribe = onSnapshot(callRef, async (snapshot) => {
      for (const change of snapshot.docChanges()) {
        const data = change.doc.data();
        if (data.receiver !== username) continue;
  
        // Handle Offer
        if (data.type === "offer" && !pc.current) {
          const pcInstance = await setupPeerConnection(false);
          await pcInstance.setRemoteDescription(new RTCSessionDescription(data.offer));
  
          const answer = await pcInstance.createAnswer();
          await pcInstance.setLocalDescription(answer);
  
          await addDoc(callRef, {
            type: "answer",
            answer,
            sender: username,
            receiver: data.sender
          });
  
          setIsCalling(true);
        }
  
        // Handle Answer
        else if (data.type === "answer" && pc.current) {
          await pc.current.setRemoteDescription(new RTCSessionDescription(data.answer));
        }
  
        // Handle ICE Candidates
        else if (data.type === "ice" && pc.current) {
          try {
            await pc.current.addIceCandidate(new RTCIceCandidate(data.candidate));
          } catch (e) {
            console.error("Error adding received ICE candidate", e);
          }
        }
      }
    });
  
    return () => unsubscribe();
  }, []);
  
  const endCall = () => {
    if (pc.current) {
      pc.current.close();
      pc.current = null;
    }
  
    if (localVideoRef.current?.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
  
    setIsCalling(false);
  };
  

  // ⚡ Cargar mensajes en tiempo real
  useEffect(() => {
    if (!isOpen) return;

    const q = query(messagesRef, orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => doc.data());
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [isOpen, contact]);

  // 🔄 Asegurar que el chat exista
  useEffect(() => {
    const checkChat = async () => {
      const chatSnap = await getDoc(chatRef);
      if (!chatSnap.exists()) {
        await setDoc(chatRef, {
          "Usuario 1": username,
          "Usuario 2": contact,
          timestamp: new Date(),
        });
      }
    };

    if (isOpen) {
      checkChat();
    }
  }, [isOpen, contact]);

  // 🚀 Enviar mensaje
  const handleSend = async () => {
    if (!message.trim()) return;

    await addDoc(messagesRef, {
      contenido: message,
      sender: username,
      receiver: contact,
      timestamp: new Date(),
    });

    setMessage("");
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div
      className="chat-modal"
      style={{
        position: "fixed",
        zIndex: 9999,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "white",
        padding: "20px",
        width: "500px",
        height: "600px",
      }}
    >
      <div className="headerChat">
        <h5>Chatea con {contact}</h5>
      </div>

      <div
        className="chat-box border rounded p-3"
        style={{ height: "300px", overflowY: "auto" }}
      >
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.sender === username ? "Tú" : msg.sender}:</strong>{" "}
            {msg.contenido}
          </p>
        ))}
      </div>

      <div className="mt-3">
        <input
          type="text"
          className="form-control"
          placeholder="Escribir..."
          value={message}
          onChange={handleInputChange}
        />
      </div>

      <div className="modal-footer mt-3">
        <button type="button" className="btn btn-primary" onClick={handleSend}>
          Enviar
        </button>
        <button type="button" className="btn btn-success" onClick={handleCall}>
        Videollamada
        </button>
        <button type="button" className="btn btn-secondary" onClick={handleClose}>
          Cerrar
        </button>
      </div>
      {isCalling && (
      <div className="video-container mt-3 d-flex flex-column gap-3 align-items-center">
      <div className="d-flex gap-2">
      <video ref={localVideoRef} autoPlay muted style={{ width: "48%" }} />
      <video ref={remoteVideoRef} autoPlay style={{ width: "48%" }} />
      </div>
      <button className="btn btn-danger mt-2" onClick={endCall}>
      Terminar llamada
      </button>
      </div>
      )}

    </div>
  );
}

export default ChatModal;
