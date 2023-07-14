import { useEffect, useState, useRef } from 'react';
import Select from 'react-select';
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithRedirect, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, collection, getDocs, setDoc, doc, getDoc} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAND-f66DOR7bvODxWFt_d1RwtcQyIDkPc",
  authDomain: "classmate-bf456.firebaseapp.com",
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

function App() {
  const [classesData, setClassesData] = useState([]);
  const [userClasses, setUserClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isHonors, setIsHonors] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);

  const daysOfWeek = [
    { value: 'Monday', label: 'Monday' },
    { value: 'Tuesday', label: 'Tuesday' },
    { value: 'Wednesday', label: 'Wednesday' },
    { value: 'Thursday', label: 'Thursday' },
    { value: 'Friday', label: 'Friday' },
  ];

  const inputRef = useRef();


  useEffect(() => {
    const fetchClassData = async () => {
      const data = [];
      const querySnapshot = await getDocs(collection(db, "classes"));
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        data.push({ id: doc.id, ...doc.data() });
      });
      setClassesData(data);
    }
  
    fetchClassData();

    const fetchUserClasses = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = doc(db, "users", user.uid);
        const userData = await getDoc(userDoc);
        const currentUserData = userData.data();
        const currentClasses = currentUserData.classes || [];

        setUserClasses(currentClasses);
      }
    }
  
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log('User:', user);
        const credential = GoogleAuthProvider.credentialFromResult(user);
        console.log('Credential:', credential);
        
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName,
        }, { merge: true });

        fetchUserClasses();
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
    }).catch((error) => {
      console.error("An error happened during sign-out:", error);
    });
  }


  // handle add class. When a row is clicked, add the class's id to the array of classes in the user's document
  const handleAddClass = async (data) => {
  const user = auth.currentUser;
  if (user) {
    const userDoc = doc(db, "users", user.uid);
    const userData = await getDoc(userDoc);
    const currentUserData = userData.data();
    const currentClasses = currentUserData.classes || [];

    const newClassesData = [...currentClasses, {
      id: data.id,
      subjectAbbreviation: data.subjectAbbreviation,
      courseNumber: data.courseNumber,
      title: data.title,
      section: data.section,
      days: data.days,
      startTime: data.startTime,
      endTime: data.endTime,
      creditHours: data.creditHours,
      honors: data.honors,
      instructor: data.instructor
    }];
    
    await setDoc(userDoc, {
      ...currentUserData,
      classes: newClassesData,
    });

    setUserClasses(newClassesData);
  }
};


  return (
    <>
      <h1>Hello, world!</h1>
      <button onClick={signInWithGoogle}>Sign In With Google</button>
      <button onClick={signOutUser}>Sign Out</button>
      <form onSubmit={(e) => {
        e.preventDefault();
        setSearchTerm(inputRef.current.value);
      }}>
        <input ref={inputRef} type="text" placeholder="Search for a class" />
        <button type="submit">Search</button>
      </form>
      <div>
        <label>Show only honors classes</label>
        <input
          type="checkbox"
          checked={isHonors}
          onChange={(e) => setIsHonors(e.target.checked)}
        />
      </div>
      <div>
        <label>Filter by days of the week</label>
        <Select
          isMulti
          options={daysOfWeek}
          onChange={(selectedOptions) =>
            setSelectedDays(selectedOptions.map(option => option.value))
          }
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>Subject Abbreviation</th>
            <th>Course Number</th>
            <th>Title</th>
            <th>Section</th>
            <th>Days</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Credit Hours</th>
            <th>Honors</th>
            <th>Instructor</th>
          </tr>
        </thead>
        <tbody>
          {classesData
            .filter(classData =>
              classData.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              `${classData.subjectAbbreviation} ${classData.courseNumber}`.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .filter(classData =>
              (!isHonors || classData.honors) &&
              selectedDays.every(day => classData.days.includes(day))
            )
            .map((data, index) => (
              <tr key={index} onClick={() => handleAddClass(data)}>
                <td>{data.subjectAbbreviation}</td>
                <td>{data.courseNumber}</td>
                <td>{data.title}</td>
                <td>{data.section}</td>
                <td>{data.days}</td>
                <td>{data.startTime}</td>
                <td>{data.endTime}</td>
                <td>{data.creditHours}</td>
                <td>{data.honors ? "Yes" : "No"}</td>
                <td>{data.instructor}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <h3>Hello {auth.currentUser ? auth.currentUser.displayName : 'Guest'}</h3>
      <table>
        <thead>
          <tr>
            <th>Subject Abbreviation</th>
            <th>Course Number</th>
            <th>Title</th>
            <th>Section</th>
            <th>Days</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Credit Hours</th>
            <th>Honors</th>
            <th>Instructor</th>
          </tr>
        </thead>
        <tbody>
          {userClasses.map((data, index) => (
            <tr key={index}>
              <td>{data.subjectAbbreviation}</td>
              <td>{data.courseNumber}</td>
              <td>{data.title}</td>
              <td>{data.section}</td>
              <td>{data.days}</td>
              <td>{data.startTime}</td>
              <td>{data.endTime}</td>
              <td>{data.creditHours}</td>
              <td>{data.honors ? "Yes" : "No"}</td>
              <td>{data.instructor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default App;
