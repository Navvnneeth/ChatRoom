// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCRfE9S3jxttpIQN0FhJurKf2wqCR1MFVE",
  authDomain: "chat-app-5ae8e.firebaseapp.com",
  projectId: "chat-app-5ae8e",
  storageBucket: "chat-app-5ae8e.firebasestorage.app",
  messagingSenderId: "387115571049",
  appId: "1:387115571049:web:f7213ff1b62bd21e518ff8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);