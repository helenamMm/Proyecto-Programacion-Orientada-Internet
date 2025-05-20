import React, { useRef, useState } from "react";
import { Offcanvas } from "bootstrap";

function SideMenuCursos({ isOpen, onClose, grupos = [], onGrupoSeleccionado }) {
  return (
    <div className={`offcanvas offcanvas-end ${isOpen ? "show" : ""}`}
      tabIndex="-1"
      style={{ width: "300px", transition: "transform 0.3s ease-in-out" }}
    >
      <div className="offcanvas-header text-bg-dark">
        <h5 className="offcanvas-title">Tus grupos</h5>
        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
      </div>
      <div className="offcanvas-body text-bg-dark">
        {grupos.length > 0 ? (
          grupos.map(grupo => (
            <div key={grupo.id} className="card bg-light p-2 my-2" onClick={() => onGrupoSeleccionado(grupo.id)} style={{ cursor: 'pointer' }}>
              <p>{grupo.nombre}</p>
            </div>
          ))
        ) : (
          <p className="text-light">No estás en ningún grupo.</p>
        )}
      </div>
    </div>
  );
}


export default SideMenuCursos;
