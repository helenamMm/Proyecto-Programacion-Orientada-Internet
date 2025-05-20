// src/services/grupoService.js
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";

export async function crearGrupo(nombreGrupo, miembros) {
  try {
    await addDoc(collection(db, "grupos"), {
      nombre: nombreGrupo,
      miembros: miembros,
      creadoEn: Timestamp.now(),
    });
    console.log("Grupo creado exitosamente");
  } catch (error) {
    console.error("Error al crear el grupo:", error);
    throw error; // importante para que el componente capture el error
  }
}
