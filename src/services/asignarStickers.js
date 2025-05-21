import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase/firebase";

export async function asignarStickersPorGrupos(uid) {
  const userRef = doc(db, "usuarios", uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) return;

  const data = userSnap.data();
  const gruposCreados = data.GruposCreados || 0;
  const stickersActuales = data.stickers || [];

  const nuevosStickers = [];

  if (gruposCreados >= 2 && !stickersActuales.includes("sticker_19")) {
    nuevosStickers.push("sticker_19");
  }

  if (gruposCreados >= 3 && !stickersActuales.includes("sticker_20")) {
    nuevosStickers.push("sticker_20");
  }

  if (gruposCreados >= 5 && !stickersActuales.includes("sticker_fuego")) {
    nuevosStickers.push("sticker_fuego");
  }

  if (nuevosStickers.length > 0) {
    await updateDoc(userRef, {
      stickersDesbloqueados: arrayUnion(...nuevosStickers),
    });
    console.log("Stickers nuevos asignados:", nuevosStickers);
  } else {
    console.log("No hay stickers nuevos que asignar.");
  }
}
