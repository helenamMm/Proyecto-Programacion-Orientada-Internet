import React, { useRef, useEffect, useState } from "react";

function ChatModal({ isOpen, onClose, contact }) {
    const modalRef = useRef(null);
    const prevFocusRef = useRef(null); // To keep track of the previously focused element
    const [modalVisible, setModalVisible] = useState(isOpen); // Modal state

    useEffect(() => {
        const modalElement = modalRef.current;

        // Capture the currently focused element
        const prevFocus = document.activeElement;
        prevFocusRef.current = prevFocus; // Save it

        // If modal is open, show it; if modal is closed, hide it and clean up
        if (isOpen) {
            setModalVisible(true);
            document.body.style.overflow = 'hidden'; // Disable body scroll
            modalElement.classList.add('show'); // Add the 'show' class manually
            modalElement.style.display = 'block'; // Ensure modal is visible
        } else {
            setModalVisible(false);
            document.body.style.overflow = ''; // Restore body scroll
            modalElement.classList.remove('show'); // Remove the 'show' class manually
            modalElement.style.display = ''; // Hide modal
        }

        // Clean up backdrop manually when modal is closed
        if (!isOpen) {
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
                backdrop.remove(); // Remove the backdrop from the DOM
            }
        }

        // Return focus to the previous element when modal is closed
        return () => {
            if (prevFocusRef.current) {
                prevFocusRef.current.focus();
            }
        };
    }, [isOpen]);

    // Handling the closing of the modal and restoring focus
    const handleClose = () => {
        onClose(); // Trigger parent onClose function
    };

    return (
        modalVisible && (
            <div className="modal fade show" ref={modalRef} tabIndex="-1" style={{ display: isOpen ? "block" : "none" }}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Chatea con.. {contact}</h5>
                            <button type="button" className="btn-close" onClick={handleClose}></button>
                        </div>
                        <div className="modal-body">
                            <div className="chat-box border rounded p-3" style={{ height: "300px", overflowY: "auto" }}>
                                <p><strong>{contact}:</strong> Quiubole</p>
                                <p><strong>Tú:</strong> Quiubole como estas?</p>
                            </div>
                            <div className="mt-3">
                                <input type="text" className="form-control" placeholder="Escribir..." />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary">Enviar</button>
                            <button type="button" className="btn btn-secondary" onClick={handleClose}>Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
}

export default ChatModal;
