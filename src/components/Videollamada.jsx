import React, { useState } from 'react';
import './Videollamada.css';
import useVideoCall from '../hooks/useVideoCall';

function Videollamada({ isOpen, onClose }) {
  const {
    startWebcam,
    createCall,
    answerCall,
    hangUp,
    webcamVideoRef,
    remoteVideoRef,
    callId,
  } = useVideoCall();

  const [inputCallId, setInputCallId] = useState('');

  return (
    <div className="container-video">
      <div className="videos">
        <span>
          <h3>Local Stream</h3>
          <video ref={webcamVideoRef} autoPlay playsInline />
        </span>
        <span>
          <h3>Remote Stream</h3>
          <video ref={remoteVideoRef} autoPlay playsInline />
        </span>
      </div>

      <div className="Botones">
        <button onClick={startWebcam}>Activar cámara</button>
        <button onClick={async () => await createCall()}>Llamar</button>

        <p>Answer the call from a different browser window or device</p>
        <input
          value={inputCallId}
          onChange={(e) => setInputCallId(e.target.value)}
          placeholder="Enter Call ID"
        />
        <button onClick={() => answerCall(inputCallId)}>Answer</button>

        <button onClick={hangUp}>Hangup</button>
      </div>
      <p>Entered Call ID: {inputCallId}</p>

    </div>
  );
}

export default Videollamada;