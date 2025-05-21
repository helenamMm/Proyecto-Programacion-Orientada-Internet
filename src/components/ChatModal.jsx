//Este trabajao esta bien vergas te la rifaste Andy te quiero mucho 
import React, { useRef, useEffect, useState } from "react";
import './ChatModal.css';
import Videollamada from './Videollamada';
import { db } from "../firebase/firebase";
//import { useRef, useEffect } from "react";
import {
  collection,
  doc,
  setDoc,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  getDoc,
  updateDoc,
  increment
} from "firebase/firestore";



function ChatModal({ isOpen, onClose, contact }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const username = localStorage.getItem("username");
  const isGroup = contact.startsWith("grupo_");
  const uid = localStorage.getItem("uid");
  const [mostrarStickers, setMostrarStickers] = useState(false);
  const chatId = isGroup ? contact : [username, contact].sort().join("_");
  const chatRef = doc(db, "chats", chatId);
  const messagesRef = collection(chatRef, "mensajes");
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [stickerDesbloqueado, setStickerDesbloqueado] = useState(null);
const [mostrarModalSticker, setMostrarModalSticker] = useState(false);
const [stickersDesbloqueados, setStickersDesbloqueados] = useState([]);
const chatEndRef = useRef(null);
const obtenerEmojiSticker = (stickerId) => {
  const emojis = {
    sticker_estrella: "🌟",
    sticker_fuego: "🔥",
    sticker_8: "🧩",
    sticker_15: "🏆",
    sticker_16:"👽", 
    sticker_18: "😺", 
    sticker_19:"🤖", 
    sticker_20:"👾", 
  };

  return emojis[stickerId] || "✨";
};

useEffect(() => {
  if (chatEndRef.current) {
    chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  }
}, [messages]);


  useEffect(() => {
    if (!isOpen) return;

    const q = query(messagesRef, orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => doc.data());
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [isOpen, contact]);

  useEffect(() => {
    const checkChat = async () => {
      if (isGroup) return;

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

  useEffect(() => {
  const cargarStickers = async () => {
    const userRef = doc(db, "usuarios", uid);
    const userSnap = await getDoc(userRef);
    const data = userSnap.data();
    setStickersDesbloqueados(data.stickersDesbloqueados || []);
  };

  if (isOpen) {
    cargarStickers();
  }
}, [isOpen]);


  // 🚀 Enviar mensaje
  const handleSend = async () => {
    if (!message.trim()) return;

    await addDoc(messagesRef, {
      contenido: message,
      sender: username,
      receiver: contact,
      timestamp: new Date(),
    });

    // 👇 Incrementar contador de mensajes privados enviados
    
     if (!isGroup) {
    const userRef = doc(db, "usuarios", uid);

    // Incrementar el contador
    await updateDoc(userRef, {
      mensajesPrivadosEnviados: increment(1)
    });

    // Obtener datos actualizados para verificar desbloqueo de stickers
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();
    //const mensajesEnviados = (userData.mensajesPrivadosEnviados || 0) + 1; // Asumimos que acabamos de sumar 1
    const mensajesEnviados = userData.mensajesPrivadosEnviados || 0;
    const stickers = userData.stickersDesbloqueados || [];

    const nuevosStickers = [];

    if (mensajesEnviados === 8 && !stickers.includes("sticker_8")) {
      nuevosStickers.push("sticker_8");
    }

    if (mensajesEnviados === 15 && !stickers.includes("sticker_15")) {
      nuevosStickers.push("sticker_15");
    }
    if (mensajesEnviados === 20 && !stickers.includes("sticker_16")) {
      nuevosStickers.push("sticker_16");
    }
    if (mensajesEnviados === 30 && !stickers.includes("sticker_18")) {
      nuevosStickers.push("sticker_18");
    }

      if (nuevosStickers.length > 0) {
  await updateDoc(userRef, {
    stickersDesbloqueados: [...stickers, ...nuevosStickers]
  });

  setStickerDesbloqueado(nuevosStickers[0]); // solo uno a la vez
  setMostrarModalSticker(true);

  setTimeout(() => {
    setMostrarModalSticker(false);
    setStickerDesbloqueado(null);
  }, 4000); // 4 segundos de celebración
}

  }

    setMessage("");
  };

      const handleSendSticker = async (stickerId) => {
  await addDoc(messagesRef, {
    contenido: `:sticker_${stickerId}:`,
    sender: username,
    receiver: contact,
    timestamp: new Date(),
  });
};

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleClose = () => {
    onClose();
  };

  const handleVideoClose = () => {
    setIsVideoCallOpen(false);
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
      {isVideoCallOpen ? (
        <Videollamada isOpen={isVideoCallOpen} onClose={handleVideoClose} />
      ) : (
        <>
          <div className="headerChat">
            <h5>Chatea con {contact}</h5>
          </div>

         <div
  className="chat-box border rounded p-3"
  style={{ height: "300px", overflowY: "auto" }}
>
  {messages.map((msg, index) => {
    const esSticker = msg.contenido.startsWith(":sticker_") && msg.contenido.endsWith(":");
    const nombreSticker = msg.contenido.replace(/:sticker_|:/g, "");

    return (
      <p key={index}>
        <strong>{msg.sender === username ? "Tú" : msg.sender}:</strong>{" "}
        {esSticker ? (
          <span style={{ fontSize: "24px" }}>{obtenerEmojiSticker(nombreSticker)}</span>
        ) : (
          msg.contenido
        )}
      </p>
    );
  })}

  {/* 🔽 Aquí el scroll automático */}
  <div ref={chatEndRef}></div>
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
            {!isGroup && (
              <button
                type="button"
                className="btn btn-success"
                onClick={() => setIsVideoCallOpen(true)}
              >
                Videollamada
              </button>
            )}
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              Cerrar
            </button>
          </div>

            <div className="d-flex align-items-center mt-2">
            <button className="btn btn-warning me-2" onClick={() => setMostrarStickers(!mostrarStickers)}>
              🙂 Stickers
            </button>
          </div>

          {mostrarStickers && (
            <div
              className="border p-2 mt-2"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                maxHeight: "100px",
                overflowY: "auto",
              }}
            >
              {stickersDesbloqueados.map((sticker, index) => (
                <div
                  key={index}
                  style={{ cursor: "pointer", fontSize: "24px" }}
                  onClick={() => handleSendSticker(sticker)}
                >
                  {obtenerEmojiSticker(sticker)}
                </div>
              ))}
            </div>
            

          )}



        </>
      )}

      {mostrarModalSticker && stickerDesbloqueado && (
  <div
    style={{
      position: "fixed",
      top: "30%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      background: "#fff",
      padding: "20px",
      border: "3px solid gold",
      borderRadius: "15px",
      zIndex: 10000,
      textAlign: "center",
      boxShadow: "0 0 20px rgba(0,0,0,0.3)"
    }}
  >
    <h4>🎉 ¡Sticker desbloqueado!</h4>
    <p>Has ganado el sticker <strong>{stickerDesbloqueado}</strong></p>
    {/* Aquí podrías mostrar una imagen si tienes algo como /stickers/sticker_8.png */}
    {/* <img src={`/stickers/${stickerDesbloqueado}.png`} alt="Sticker desbloqueado" width="100" /> */}
    <button className="btn btn-outline-primary mt-2" onClick={() => setMostrarModalSticker(false)}>
      Cerrar
    </button>
  </div>
)}

    </div>
  );
}

export default ChatModal;
