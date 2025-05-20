import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import {
  collection,
  doc,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  getDoc,
  setDoc,
} from "firebase/firestore";

function ChatGrupo({ grupoId, onClose }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const username = localStorage.getItem("username");
  const [nombreGrupo, setNombreGrupo] = useState(""); // nuevo estado


  const grupoRef = doc(db, "grupos", grupoId);
  const mensajesRef = collection(grupoRef, "mensajes");

  // 🔄 Cargar mensajes en tiempo real
  useEffect(() => {
    const q = query(mensajesRef, orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => doc.data());
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [grupoId]);

  // ✅ Verifica que el grupo exista (por si acaso)
 useEffect(() => {
  const checkGrupo = async () => {
    const grupoSnap = await getDoc(grupoRef);
    if (!grupoSnap.exists()) {
      await setDoc(grupoRef, {
        creadoPor: username,
        timestamp: new Date(),
        nombre: "Grupo sin nombre",
      });
      setNombreGrupo("Grupo sin nombre");
    } else {
      const data = grupoSnap.data();
      setNombreGrupo(data.nombre || "Grupo sin nombre");
    }
  };

  checkGrupo();
}, [grupoId]);


  // 🚀 Enviar mensaje
  const handleSend = async () => {
    if (!message.trim()) return;

    await addDoc(mensajesRef, {
      contenido: message,
      sender: username,
      timestamp: new Date(),
    });

    setMessage("");
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
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="headerChat" style={{ marginBottom: "1rem" }}>
        <h5>Grupo: {nombreGrupo}</h5>
      </div>

      <div
        className="chat-box border rounded p-3"
        style={{ flex: 1, overflowY: "auto" }}
      >
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.sender === username ? "Tú" : msg.sender}:</strong>{" "}
            {msg.contenido}
          </p>
        ))}
      </div>

      <div className="mt-3 d-flex gap-2" style={{ marginTop: "1rem" }}>
        <input
          type="text"
          className="form-control"
          placeholder="Escribir..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ flex: 1 }}
        />
        <button className="btn btn-primary" onClick={handleSend}>
          Enviar
        </button>
        <button className="btn btn-secondary" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
}

export default ChatGrupo;
