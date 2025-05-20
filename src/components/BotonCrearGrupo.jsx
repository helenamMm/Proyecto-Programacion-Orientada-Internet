import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { crearGrupo } from "../services/grupoService";

function BotonCrearGrupo({ onGrupoCreado }) {
  const [usuarios, setUsuarios] = useState([]);
  const [nombreGrupo, setNombreGrupo] = useState("");
  const [miembrosSeleccionados, setMiembrosSeleccionados] = useState([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const snapshot = await getDocs(collection(db, "usuarios"));
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          nombre: doc.data().nombre,
        }));
        setUsuarios(data);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    };
    fetchUsuarios();
  }, []);

  const toggleMiembro = (id) => {
    setMiembrosSeleccionados(prev =>
      prev.includes(id)
        ? prev.filter(uid => uid !== id)
        : [...prev, id]
    );
  };

  const guardarGrupo = async () => {
    if (!nombreGrupo.trim() || miembrosSeleccionados.length === 0) {
      alert("Por favor, ponle nombre al grupo y selecciona al menos un miembro.");
      return;
    }

    try {
      await crearGrupo(nombreGrupo, miembrosSeleccionados);

      //alert("Grupo creado con éxito 🎉");
      setNombreGrupo("");
      setMiembrosSeleccionados([]);

      if (onGrupoCreado) onGrupoCreado();

    } catch (error) {
      alert("Ocurrió un error al crear el grupo.");
    }
  };

  return (
    <div className="p-3 bg-light rounded">
      <h5>Crear Grupo</h5>
      <input
        type="text"
        placeholder="Nombre del grupo"
        value={nombreGrupo}
        onChange={e => setNombreGrupo(e.target.value)}
        className="form-control mb-2"
      />

      <div>
        <strong>Selecciona usuarios:</strong>
        <ul className="list-group" style={{ maxHeight: "150px", overflowY: "auto" }}>
          {usuarios.map(user => (
            <li key={user.id} className="list-group-item">
              <label>
                <input
                  type="checkbox"
                  checked={miembrosSeleccionados.includes(user.id)}
                  onChange={() => toggleMiembro(user.id)}
                />
                {" "}{user.nombre}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <button className="btn btn-success mt-3" onClick={guardarGrupo}>
        Crear grupo
      </button>
    </div>
  );
}

export default BotonCrearGrupo;
