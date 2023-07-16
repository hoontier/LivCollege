import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { auth } from '../config/firebaseConfig';
import styles from '../styles/SignIn.module.css';

function SignIn( {isLoading} ) {
  
  


  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
  };


  return (
    <div className={styles.homeContainer}>
      <h1 className={styles.title}>ClassMate</h1>
      {isLoading ? (
        <h3 className={styles.loading}>Loading...</h3>
      ) : (
        <button onClick={signInWithGoogle} className={styles.button}>Sign In With Google</button>
      )}
    </div>
  );  
}

export default SignIn;
