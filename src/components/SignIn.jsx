import { useEffect } from 'react';
import { GoogleAuthProvider, signInWithRedirect, onAuthStateChanged, signOut } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from '../config/firebaseConfig';

function SignIn( {setUser} ) {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log('User:', user);
        const credential = GoogleAuthProvider.credentialFromResult(user);
        console.log('Credential:', credential);
        
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName,
        }, { merge: true });
      } else {
        console.log('No user is signed in.');
      }
    });
  
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
  };
  
  const signOutUser = () => {
    signOut(auth).then(() => {
      console.log("Sign-out successful.");
      setUser(null); // Set user to null when signed out
    }).catch((error) => {
      console.error("An error happened during sign-out:", error);
    });
  }
  

  return (
    <>
      <button onClick={signInWithGoogle}>Sign In With Google</button>
      <button onClick={signOutUser}>Sign Out</button>
      <h3>Hello {auth.currentUser ? auth.currentUser.displayName : 'Guest'}</h3>
    </>
  );
}

export default SignIn;
