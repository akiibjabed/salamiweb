import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, doc, getDoc, getDocs, setDoc, updateDoc, addDoc, onSnapshot, query, where, orderBy, getDocFromServer, deleteDoc } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export { 
  signInWithPopup, 
  onAuthStateChanged,
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  addDoc, 
  deleteDoc,
  onSnapshot, 
  query, 
  where, 
  orderBy,
  getDocFromServer
};

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration. ");
    }
  }
}
testConnection();
