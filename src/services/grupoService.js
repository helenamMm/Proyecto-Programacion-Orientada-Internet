// src/services/grupoService.js
import { collection, addDoc, Timestamp, doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { asignarStickersPorGrupos } from "./asignarStickers"; 
export async function crearGrupo(nombreGrupo, miembros) {
  try {
    // Obtener uid del usuario creador
    const uid = localStorage.getItem("uid");
    if (!uid) throw new Error("Usuario no autenticado");

    // 1. Crear el grupo
    await addDoc(collection(db, "grupos"), {
      nombre: nombreGrupo,
      miembros: miembros,
      creadoEn: Timestamp.now(),
      creador: uid,
    });

    // 2. Incrementar GruposCreados en el documento del usuario
    const userRef = doc(db, "usuarios", uid);
    await updateDoc(userRef, {
      GruposCreados: increment(1),
    });
    await asignarStickersPorGrupos(uid);

    console.log("Grupo creado exitosamente");
  } catch (error) {
    console.error("Error al crear el grupo:", error);
    throw error;
  }
}
