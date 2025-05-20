import React from "react";
import BotonCrearGrupo from "./BotonCrearGrupo";

function CrearGrupoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1050,
      }}
      onClick={onClose}  // cerrar modal si clic fuera
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "20px",
          maxWidth: "500px",
          width: "90%",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
        }}
        onClick={(e) => e.stopPropagation()} // evitar cierre clic dentro
      >
        <button className="btn btn-danger mb-3" onClick={onClose}>Cerrar</button>
        <BotonCrearGrupo onGrupoCreado={onClose} />
      </div>
    </div>
  );
}

export default CrearGrupoModal;
