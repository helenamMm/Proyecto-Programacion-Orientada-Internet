import React, { useState } from "react";
import { db } from "../firebase/firebase";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";


function ChecklistModal({ onClose }) {
  const [titulo, setTitulo] = useState("");
  const [tareas, setTareas] = useState([""]);
  const username = localStorage.getItem("username");
 const uid = localStorage.getItem("uid");


useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
    setUser(firebaseUser);
  });
  return () => unsubscribe();
}, []);



  const agregarTarea = () => setTareas([...tareas, ""]);
  const cambiarTarea = (index, valor) => {
    const nuevasTareas = [...tareas];
    nuevasTareas[index] = valor;
    setTareas(nuevasTareas);
  };

  const crearChecklist = async () => {
    if (!titulo.trim() || !user) {
  console.error("No hay usuario logueado o título vacío");
  return;
}

    // 1. Crear documento de checklist
 
    const checklistRef = await addDoc(collection(db, "checklists"), {
  titulo,
  usuario: uid, // ← aquí usas el uid del localStorage
  fechaCreacion: new Date(),
  completada: false,
});


    // 2. Agregar las tareas como subcolección
    const tareasRef = collection(checklistRef, "tareas");
    await Promise.all(
      tareas.map(t => 
        addDoc(tareasRef, {
          descripcion: t,
          estado: "por hacer",
          fechaCambio: new Date(),
        })
      )
    );

    onClose();
  };

  return (
    <div className="modal d-block" style={{ backgroundColor: "#000000aa" }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content p-4">
          <h4>Crear nueva lista de tareas</h4>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Título del checklist"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
          {tareas.map((tarea, index) => (
            <input
              key={index}
              type="text"
              className="form-control mb-2"
              placeholder={`Tarea ${index + 1}`}
              value={tarea}
              onChange={(e) => cambiarTarea(index, e.target.value)}
            />
          ))}
          <button className="btn btn-outline-secondary mb-3" onClick={agregarTarea}>
            + Agregar otra tarea
          </button>
          <div className="d-flex justify-content-end gap-2">
            <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button className="btn btn-primary" onClick={crearChecklist}>
  Guardar
</button>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ChecklistModal;
