// SignIn.jsx
import { useSelector } from 'react-redux';
import { GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { setDoc, doc } from 'firebase/firestore';


function SignIn() {
  const isLoading = useSelector((state) => state.data.isLoading);

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
  };

  

  return (
    <div>
      <h1>LIV</h1>
      {isLoading ? (
        <h3>Loading...</h3>
      ) : (
        <button onClick={signInWithGoogle}>Sign In With Google</button>
      )}
    </div>
  );
}

export default SignIn;

