import React, { useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase"; 
import { collection, query, where, getDocs } from "firebase/firestore";


function LoginModal({ isOpen, onClose, onLogin }) {
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");

/*
const handleLogin = async () => {
    if (!username) {
        setError("Please enter a username");
        return;
    }

    try {
        const userRef = doc(db, "usuarios", username.trim()); // Fetch user by document ID
        const snapshot = await getDoc(userRef);

        if (snapshot.exists()) {
            onLogin(username);
            onClose();
        } else {
            setError("User not found");
        }
    } catch (error) {
        console.error("Error fetching user:", error);
        setError("An error occurred");
    }
};*/
const handleLogin = async () => {
    if (!username) {
      setError("Please enter a username");
      return;
    }
  
    try {
      const q = query(
        collection(db, "usuarios"),
        where("nombre", "==", username.trim())
      );
  
      const querySnapshot = await getDocs(q);
  
        if (!querySnapshot.empty) {
  const userDoc = querySnapshot.docs[0];
  const nombreUsuario = userDoc.data().nombre;
  const uid = userDoc.id; // Este es el ID real del documento

  onLogin({ nombre: nombreUsuario, uid }); // Pasa ambos al estado
  localStorage.setItem("username", nombreUsuario);
  localStorage.setItem("uid", uid); // Guarda el ID del usuario
  onClose();
} else {
        setError("User not found");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setError("An error occurred");
    }
  };
  

    return (
        isOpen && (
            <div className="modal fade show" tabIndex="-1" style={{ display: "block" }}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Login</h5>
                            <button type="button" className="btn-close" onClick={onClose}></button>
                        </div>
                        <div className="modal-body">
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Enter username" 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            {error && <p className="text-danger mt-2">{error}</p>}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={handleLogin}>Login</button>
                            <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
}

export default LoginModal;
