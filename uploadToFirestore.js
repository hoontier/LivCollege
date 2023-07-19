import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = {
  apiKey: "AIzaSyAND-f66DOR7bvODxWFt_d1RwtcQyIDkPc",
  authDomain: "classmate-bf456.firebaseapp.com",
  projectId: "classmate-bf456",
  storageBucket: "classmate-bf456.appspot.com",
  messagingSenderId: "234554292125",
  appId: "1:234554292125:web:8dce419e86d0c1f3c56174",
  measurementId: "G-2S3034LDWE"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Load JSON data and upload it to Firestore
fs.readFile('./classes.json', 'utf8', (err, jsonString) => {
  if (err) {
    console.log("File read failed:", err);
    return;
  }
  const data = JSON.parse(jsonString);
  data.forEach(async doc => {
    try {
      const docRef = await addDoc(collection(db, "classes"), doc);
      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  });
});

// run with npx babel-node uploadToFirestore.js

