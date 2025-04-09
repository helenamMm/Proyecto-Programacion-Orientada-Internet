import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'; // Import the Firestore function

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD9x7ghlBLEty8tD4LNHz1FtP5blHwjev8",
  authDomain: "prograoi.firebaseapp.com",
  projectId: "prograoi",
  storageBucket: "prograoi.firebasestorage.app",
  messagingSenderId: "951591432307",
  appId: "1:951591432307:web:8e33dd379754b07217ba06"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db};
