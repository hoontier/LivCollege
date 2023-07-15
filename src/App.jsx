import { useEffect, useState, useRef } from 'react';
import { onAuthStateChanged} from "firebase/auth";
import { collection, getDocs, setDoc, doc, getDoc} from "firebase/firestore";
import { auth, db } from './config/firebaseConfig';
import SignIn from './components/SignIn';
import AllClasses from './components/AllClasses';
import UserClasses from './components/UserClasses';
import Users from './components/Users';

function App() {
  const [classesData, setClassesData] = useState([]);
  const [userClasses, setUserClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isHonors, setIsHonors] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  const [users, setUsers] = useState([])
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true);

  const daysOfWeek = [
    { value: 'Monday', label: 'Monday' },
    { value: 'Tuesday', label: 'Tuesday' },
    { value: 'Wednesday', label: 'Wednesday' },
    { value: 'Thursday', label: 'Thursday' },
    { value: 'Friday', label: 'Friday' },
  ];

  const inputRef = useRef();

  const fetchUserData = async () => {
    const data = [];
    const usersCollection = collection(db, "users");
    const userSnapshot = await getDocs(usersCollection);

    for (const user of userSnapshot.docs) {
      const userData = user.data();
      
      data.push({
        id: user.id,
        ...userData,
      });
    }
  
    setUsers(data);
    console.log(data); // Log the data to the console
  }


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

    onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setIsLoading(false);
    });

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName,
        }, { merge: true });

        fetchUserClasses();
        fetchUserData();
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
        instructor: data.instructor,
        course: data.course
      }];
      
      await setDoc(userDoc, {
        ...currentUserData,
        classes: newClassesData,
      });
    
      setUserClasses(newClassesData);
      fetchUserData(); // fetch user data again after class is added
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
      fetchUserData(); // fetch user data again after class is removed
    }
  };
  

  return (
    <>
      <h1>ClassMate</h1>
      <SignIn setUser={setUser} isLoading={isLoading}/>
      {user && (
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
          <Users users={users}/>
        </>
      )}
    </>
  );
}

export default App;
