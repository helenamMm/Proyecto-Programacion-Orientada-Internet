import React, { useRef, useState, useEffect } from "react";
import { Offcanvas } from "bootstrap";
import ChatModal from "./ChatModal";

import { db } from "../firebase/firebase"; // Asegúrate que la ruta sea correcta
import { collection, getDocs } from "firebase/firestore";

function SideMenu({ isOpen, onClose }) {
    const offcanvasRef = useRef(null);
    const [selectedContact, setSelectedContact] = useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [usuarios, setUsuarios] = useState([]); // Aquí guardamos los nombres

    // Obtener los nombres de Firebase
    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "usuarios"));
                const nombres = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    nombre: doc.data().nombre
                }));
                setUsuarios(nombres);
            } catch (error) {
                console.error("Error al obtener usuarios:", error);
            }
        };

        fetchUsuarios();
    }, []);

    const openChat = (contactName) => {
        onClose();  // Cierra el menú
        setSelectedContact(contactName);
        setIsChatOpen(true);  // Abre el modal del chat
    };

    const handleModalClose = () => {
        setIsChatOpen(false);  // Cierra el modal
        onClose();  // Reabre el menú
    };

    useEffect(() => {
        const offcanvasElement = offcanvasRef.current;
        if (offcanvasElement) {
            const offcanvas = new Offcanvas(offcanvasElement);
            isOpen ? offcanvas.show() : offcanvas.hide();
        }
    }, [isOpen]);

    return (
        <>
            <div
                className="offcanvas offcanvas-start text-bg-dark"
                ref={offcanvasRef}
                id="chatMenu"
                style={{ zIndex: 1050 }}
            >
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title">Contactos</h5>
                    <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                </div>
                <div className="offcanvas-body">
                    <ul className="list-group list-group-flush">
                        {usuarios.map(user => (
                            <li
                                key={user.id}
                                className="list-group-item list-group-item-action"
                                onClick={() => openChat(user.nombre)}
                            >
                                {user.nombre}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {isChatOpen && (
                <ChatModal
                    isOpen={isChatOpen}
                    onClose={handleModalClose}
                    contact={selectedContact}
                    style={{ zIndex: 9999 }}
                />
            )}
        </>
    );
}

export default SideMenu;
