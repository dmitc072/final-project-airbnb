// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { getStorage } from 'firebase/storage';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC2EUK7nKg49ctwFtdlDQnu7IEmKX7EpwM",
  authDomain: "airbnb-34423.firebaseapp.com",
  databaseURL: "https://airbnb-34423-default-rtdb.firebaseio.com",
  projectId: "airbnb-34423",
  storageBucket: "airbnb-34423.appspot.com",
  messagingSenderId: "458262467779",
  appId: "1:458262467779:web:8ede11ada74cdf30f17e76",
  measurementId: "G-0MFL3YBQM6"
};


const app = initializeApp(firebaseConfig);


const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);
const storage = getStorage(app);


// if (!firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig);
// }

//Connect to Firebase emulators for local development
// if (window.location.hostname === 'localhost') {
  
//   //Firestore Emulator
//   connectFirestoreEmulator(db, 'localhost', 8080);
  
//   //Authentication Emulator
//   connectAuthEmulator(auth, 'http://localhost:9099');
  
//   //Functions Emulator
//   connectFunctionsEmulator(functions, 'localhost', 5001);
  
//   // Storage Emulator
//   connectStorageEmulator(storage, 'localhost', 9199);
// }

export { auth, db, storage, functions};
export const placesKey = 'AIzaSyD4fo-IYKa3bRUTwFotYVA41zLE_ByJuKM';
export default app;