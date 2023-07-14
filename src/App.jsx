import { useEffect, useState, useRef } from 'react';
import { onAuthStateChanged} from "firebase/auth";
import { collection, getDocs, setDoc, doc, getDoc} from "firebase/firestore";
import { auth, db } from './config/firebaseConfig';
import SignIn from './components/SignIn';
import AllClasses from './components/AllClasses';
import UserClasses from './components/UserClasses';

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
  


  // handle add class. When a row is clicked, add the class's id to the array of classes in the user's document
  const handleAddClass = async (data) => {
    const user = auth.currentUser;
    if (user) {
      const userDoc = doc(db, "users", user.uid);
      const userData = await getDoc(userDoc);
      const currentUserData = userData.data();
      const currentClasses = currentUserData.classes || [];
  
      // Check if class already exists in currentClasses
      if (currentClasses.some(classItem => classItem.id === data.id)) {
        console.log('Class already exists in user data.');
        return;
      }
  
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
  
  const handleRemoveClass = async (data) => {
    const user = auth.currentUser;
    if (user) {
      const userDoc = doc(db, "users", user.uid);
      const userData = await getDoc(userDoc);
      const currentUserData = userData.data();
      const currentClasses = currentUserData.classes || [];
  
      const newClassesData = currentClasses.filter(
        (classItem) => classItem.id !== data.id
      );
      
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
      <SignIn />
      {auth.currentUser && (
        <>
          <AllClasses
            classesData={classesData}
            searchTerm={searchTerm}
            isHonors={isHonors}
            selectedDays={selectedDays}
            handleAddClass={handleAddClass}
            inputRef={inputRef}
            daysOfWeek={daysOfWeek}
            setSelectedDays={setSelectedDays}
            setSearchTerm={setSearchTerm}
            setIsHonors={setIsHonors}
          />
          <UserClasses
            userClasses={userClasses}
            handleRemoveClass={handleRemoveClass}
          />
        </>
      )}
    </>
  );
}

export default App;
