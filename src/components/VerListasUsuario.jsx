// VerListasUsuario.jsx
import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

function VerListasUsuario() {
  const [listas, setListas] = useState([]);
  const uid = localStorage.getItem("uid");

  useEffect(() => {
    const obtenerListas = async () => {
      try {
        const q = query(collection(db, "listas"), where("usuario", "==", uid));
        const querySnapshot = await getDocs(q);
        const listasConTareas = [];

        for (const docLista of querySnapshot.docs) {
          const tareasSnap = await getDocs(
            collection(db, "listas", docLista.id, "tareas")
          );
          const tareas = tareasSnap.docs.map((t) => ({
            id: t.id,
            ...t.data(),
          }));
          listasConTareas.push({
            id: docLista.id,
            ...docLista.data(),
            tareas,
          });
        }

        setListas(listasConTareas);
      } catch (error) {
        console.error("Error obteniendo listas:", error);
      }
    };

    obtenerListas();
  }, [uid]);

  const verificarYActualizarListaCompletada = async (idLista) => {
    const tareasSnap = await getDocs(collection(db, "listas", idLista, "tareas"));
    const todasCompletadas = tareasSnap.docs.every(
      (doc) => doc.data().completada === true
    );

    const listaRef = doc(db, "listas", idLista);
    await updateDoc(listaRef, {
      completada: todasCompletadas,
    });

    // Actualizar el estado local
    setListas((prev) =>
      prev.map((lista) =>
        lista.id === idLista
          ? { ...lista, completada: todasCompletadas }
          : lista
      )
    );
  };

  const toggleTarea = async (idLista, tarea) => {
    try {
      const tareaRef = doc(db, "listas", idLista, "tareas", tarea.id);
      await updateDoc(tareaRef, {
        completada: !tarea.completada,
      });

      // Actualizar en el estado local
      setListas((prev) =>
        prev.map((lista) =>
          lista.id === idLista
            ? {
                ...lista,
                tareas: lista.tareas.map((t) =>
                  t.id === tarea.id
                    ? { ...t, completada: !t.completada }
                    : t
                ),
              }
            : lista
        )
      );

      // Verificar si todas las tareas están completadas
      await verificarYActualizarListaCompletada(idLista);
    } catch (error) {
      console.error("Error actualizando tarea:", error);
    }
  };

  return (
    <div>
      <h5>Mis listas</h5>
      {listas.length === 0 ? (
        <p>No tienes listas creadas.</p>
      ) : (
        listas.map((lista) => (
          <div key={lista.id} className="mb-4 border p-2 rounded">
            <h6>
              {lista.titulo}{" "}
              {lista.completada && (
                <span role="img" aria-label="completada">
                  ✅
                </span>
              )}
            </h6>
            <ul className="list-group">
              {lista.tareas.map((tarea) => (
                <li
                  key={tarea.id}
                  className="list-group-item d-flex align-items-center"
                >
                  <input
                    type="checkbox"
                    checked={tarea.completada}
                    onChange={() => toggleTarea(lista.id, tarea)}
                    className="form-check-input me-2"
                  />
                  <span
                    style={{
                      textDecoration: tarea.completada ? "line-through" : "none",
                    }}
                  >
                    {tarea.texto}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}

export default VerListasUsuario;
