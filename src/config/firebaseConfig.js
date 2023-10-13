import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAND-f66DOR7bvODxWFt_d1RwtcQyIDkPc",
  authDomain: "liv.college",
  databaseURL: "https://classmate-bf456-default-rtdb.firebaseio.com",
  projectId: "classmate-bf456",
  storageBucket: "classmate-bf456.appspot.com",
  messagingSenderId: "234554292125",
  appId: "1:234554292125:web:8dce419e86d0c1f3c56174",
  measurementId: "G-2S3034LDWE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

export { auth, db };
