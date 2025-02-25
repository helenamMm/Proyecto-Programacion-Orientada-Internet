import React, { useRef, useState } from "react";
import { Offcanvas } from "bootstrap"; 
import ChatModal from "./ChatModal"; 

function SideMenu({ isOpen, onClose }) {
    const offcanvasRef = useRef(null); 
    const [selectedContact, setSelectedContact] = useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false);

    const openChat = (contactName) => {
        setSelectedContact(contactName);
        setIsChatOpen(true);
    };

    React.useEffect(() => {
        const offcanvasElement = offcanvasRef.current;
        if (offcanvasElement) {
            const offcanvas = new Offcanvas(offcanvasElement); // Create Bootstrap Offcanvas instance
            isOpen ? offcanvas.show() : offcanvas.hide(); // Open or close based on state
        }
    }, [isOpen]); // Run this effect whenever `isOpen` changes

    return (
      <>
        <div className="offcanvas offcanvas-start text-bg-dark" ref={offcanvasRef} id="chatMenu">
            <div className="offcanvas-header">
                <h5 className="offcanvas-title">Contactos</h5>
                <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
            </div>
            <div className="offcanvas-body">
                <ul className="list-group list-group-flush">
                    <li className="list-group-item list-group-item-action" onClick={() => openChat("Andrea")}>Andrea</li>
                    <li className="list-group-item list-group-item-action"  onClick={() => openChat("Bob")}>Bob</li>
                    <li className="list-group-item list-group-item-action"  onClick={() => openChat("Guadalupe")}>Guadalupe</li>
                    <li className="list-group-item list-group-item-action"  onClick={() => openChat("Tadeo")}>Tadeo</li>
                </ul>
            </div>
        </div>
        {isChatOpen && <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} contact={selectedContact} />}
      </>
    );
}

export default SideMenu;
