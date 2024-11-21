import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDqRPB_3szVchYVO5jjTC0v14NkZNmiVVo",
    authDomain: "ai-chatbot-22c8d.firebaseapp.com",
    projectId: "ai-chatbot-22c8d",
    storageBucket: "ai-chatbot-22c8d.firebasestorage.app",
    messagingSenderId: "501661826076",
    appId: "1:501661826076:web:2ac218c3e0a990944933d9",
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);