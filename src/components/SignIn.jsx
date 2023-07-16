import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { auth } from '../config/firebaseConfig';

function SignIn( {isLoading} ) {
  
  


  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
  };


  return (
    <>
      <button onClick={signInWithGoogle} style={{cursor: 'pointer'}}>Sign In With Google</button>
      {isLoading && <h3>Loading...</h3>}
    </>
  );
}

export default SignIn;
