import React, { useRef, useState } from "react";
import { Offcanvas } from "bootstrap";

function SideMenuCursos({ isOpen, onClose, children }) {

    

    return (
        <div
            className={`offcanvas offcanvas-end ${isOpen ? "show" : ""}`}
            tabIndex="-1"
            style={{ width: "300px", transition: "transform 0.3s ease-in-out" }
        
        }
        >
            <div className="offcanvas-header text-bg-dark">
                <h5 className="offcanvas-title">Menú</h5>
                <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
            </div>
            <div className="offcanvas-body text-bg-dark">{children}</div>
        </div>
    );
}

export default SideMenuCursos;
