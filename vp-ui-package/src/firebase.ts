import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyChRYUfLGd3fHLK8lgOrjD2SlaxUgG03rU",
  authDomain: "vp-api-9a050.firebaseapp.com",
  projectId: "vp-api-9a050",
  storageBucket: "vp-api-9a050.firebasestorage.app",
  messagingSenderId: "49292659753",
  appId: "1:49292659753:web:730afecb0abb9171fc2038",
  measurementId: "G-L9M806VENX"
};

export function getDB() {
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return getFirestore(app);
}
