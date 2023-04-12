// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBIoUrmx2O8F78IZ7VS-wCFWXuAb2MswGE",
  authDomain: "realtor-react-d5fa0.firebaseapp.com",
  projectId: "realtor-react-d5fa0",
  storageBucket: "realtor-react-d5fa0.appspot.com",
  messagingSenderId: "1021179635651",
  appId: "1:1021179635651:web:c1e7f2d63c3c066c7d3f76",
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
