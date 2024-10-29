// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCHjHKEpVcalFbnA3NWHrEncRnNswOB08M",
  authDomain: "movie-app-9d594.firebaseapp.com",
  projectId: "movie-app-9d594",
  storageBucket: "movie-app-9d594.appspot.com",
  messagingSenderId: "563190482053",
  appId: "1:563190482053:web:d769942d0fe50f46e2d5ec",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
