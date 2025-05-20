// FormularioCrearLista.jsx
import { useState } from "react";
import { db } from "../firebase/firebase";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";

function FormularioCrearLista({ onCerrar }) {
  const [titulo, setTitulo] = useState("");
  const [tareas, setTareas] = useState([""]);
 const uid = localStorage.getItem("uid");
  const handleAgregarTarea = () => {
    setTareas([...tareas, ""]);
  };

  const handleCambioTarea = (index, valor) => {
    const nuevasTareas = [...tareas];
    nuevasTareas[index] = valor;
    setTareas(nuevasTareas);
  };

  const guardarLista = async () => {
    if (!titulo.trim() || tareas.length === 0 || tareas.some(t => !t.trim())) {
      alert("Debes ingresar un título y al menos una tarea válida.");
      return;
    }

    try {
      // Guardar la lista en la colección 'listas'
      const listaRef = await addDoc(collection(db, "listas"), {
        titulo,
        usuario: uid, // <-- Reemplaza con el UID real si lo tienes
      });

      // Agregar tareas como subcolección
      const tareasRef = collection(db, "listas", listaRef.id, "tareas");
      for (const tarea of tareas) {
        await addDoc(tareasRef, {
          texto: tarea,
          completada: false,
        });
      }

      //alert("Lista guardada con éxito.");
      onCerrar();
    } catch (error) {
      console.error("Error al guardar la lista:", error);
      alert("Hubo un error al guardar la lista.");
    }
  };

  return (
    <div>
      <h5>Crear nueva lista</h5>
      <input
        className="form-control my-2"
        placeholder="Título de la lista"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
      />
      <h6>Tareas</h6>
      {tareas.map((tarea, index) => (
        <input
          key={index}
          className="form-control my-1"
          placeholder={`Tarea ${index + 1}`}
          value={tarea}
          onChange={(e) => handleCambioTarea(index, e.target.value)}
        />
      ))}
      <button className="btn btn-outline-secondary btn-sm my-2" onClick={handleAgregarTarea}>
        Agregar otra tarea
      </button>
      <div className="d-flex justify-content-end">
        <button className="btn btn-secondary me-2" onClick={onCerrar}>
          Cancelar
        </button>
        <button className="btn btn-success" onClick={guardarLista}>
          Guardar lista
        </button>
      </div>
    </div>
  );
}

export default FormularioCrearLista;
