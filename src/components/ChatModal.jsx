import React, { useRef, useEffect, useState } from "react";
import './ChatModal.css';
import Videollamada from './Videollamada';
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
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
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

  const handleVideoClose = () => {
    setIsVideoCallOpen(false);  // Cierra el modal
    onClose();  // Reabre el menú
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
    {isVideoCallOpen ? (
      <Videollamada
        isOpen={isVideoCallOpen}
        onClose={handleVideoClose}
      />
    ) : (
      <>
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
          <button
            type="button"
            className="btn btn-success"
            onClick={() => setIsVideoCallOpen(true)}
          >
            Videollamada
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleClose}>
            Cerrar
          </button>
        </div>
      </>
    )}
  </div>
);
}

export default ChatModal;
