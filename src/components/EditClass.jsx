// EditClass.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../config/firebaseConfig';
import { updateDoc, doc, collection, getDocs, getDoc } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { updateUserClass } from '../features/classesSlice';



function EditClass({ classData, onClose }) {
    const [course, setCourse] = useState('');
    const [courseNumber, setCourseNumber] = useState('');
    const [creditHours, setCreditHours] = useState(0);
    const [days, setDays] = useState('');
    const [endTime, setEndTime] = useState('');
    const [honors, setHonors] = useState(false);
    const [instructor, setInstructor] = useState('');
    const [section, setSection] = useState('');
    const [startTime, setStartTime] = useState('');
    const [subject, setSubject] = useState('');
    const [subjectAbbreviation, setSubjectAbbreviation] = useState('');
    const [title, setTitle] = useState('');
    const dispatch = useDispatch();
    
    

    // Validate 12-hour time format
    const isValidTime = (time) => {
        const pattern = /^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/;
        return pattern.test(time);
    };

    // Convert 12-hour format to 24-hour format (this is useful if you ever need it)
    const convertTo24Hour = (time) => {
        const [hourMin, period] = time.split(' ');
        let [hours, minutes] = hourMin.split(':').map(Number);
        
        if (period === 'PM' && hours !== 12) {
            hours += 12;
        } else if (period === 'AM' && hours === 12) {
            hours = 0;
        }
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    };



    const updateUsersWithClass = async (classId, updatedClassData) => {
        // 1. Query users with this class
        const getUsersWithClass = async (classId) => {
            const usersRef = collection(db, 'users');
            const allUsersSnapshot = await getDocs(usersRef);
            
            return allUsersSnapshot.docs.filter(doc => {
                const user = doc.data();
                return user.classes && Array.isArray(user.classes) && user.classes.some(c => c.id === classId);
            });
        }
        
        
        const querySnapshot = await getUsersWithClass(classId);
        console.log(querySnapshot.docs);
        
      
        // 2. For each user, update the class data
        querySnapshot.forEach((userDoc) => {
            const userData = userDoc.data();
            const userClasses = userData.classes.map(c => c.id === classId ? updatedClassData : c);
        
            const userRef = doc(db, 'users', userDoc.id);
            updateDoc(userRef, { classes: userClasses });
        });        
    }
    


    useEffect(() => {
        if (classData) {
            setCourse(classData.course);
            setCourseNumber(classData.courseNumber);
            setCreditHours(classData.creditHours);
            setDays(classData.days);
            setEndTime(classData.endTime);
            setHonors(classData.honors);
            setInstructor(classData.instructor);
            setSection(classData.section);
            setStartTime(classData.startTime);
            setSubject(classData.subject);
            setSubjectAbbreviation(classData.subjectAbbreviation);
            setTitle(classData.title);
        }
    }, [classData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const classRef = doc(db, 'classes', classData.id); // Define the classRef here
    
        if (!isValidTime(startTime) || !isValidTime(endTime)) {
            alert("Please provide a valid time format: hh:mm AM/PM");
            return;
        }
    
        try {
            const classSnapshot = await getDoc(classRef);
            if (classSnapshot.exists()) {
                console.log(classSnapshot.id);
                console.log(classSnapshot.data());
            } else {
                console.error("Document does not exist!");
            }
    
            await updateDoc(classRef, {
                course,
                courseNumber,
                creditHours,
                days,
                endTime,
                honors,
                instructor,
                section,
                startTime,
                subject,
                subjectAbbreviation,
                title
            });
            onClose();
        } catch (error) {
            console.error("Error updating class document: ", error);
        }
    
        const updatedClassData = {
            course,
            courseNumber,
            creditHours,
            days,
            endTime,
            honors,
            instructor,
            section,
            startTime,
            subject,
            subjectAbbreviation,
            title,
            id: classData.id
        };
    
        await updateUsersWithClass(classData.id, updatedClassData);

        dispatch(updateUserClass(updatedClassData));
    }
    
    

    return (
        <div>
            <form onSubmit={handleSubmit} className="edit-class-form">
                <label>
                    Course:
                    <input 
                        type="text" 
                        value={course} 
                        onChange={e => setCourse(e.target.value)} 
                    />
                </label>
                <label>
                    Course Number:
                    <input 
                        type="text" 
                        value={courseNumber}
                        onChange={e => setCourseNumber(e.target.value)} 
                    />
                </label>
                <label>
                    Credit Hours:
                    <input 
                        type="number" 
                        value={creditHours}
                        onChange={e => setCreditHours(e.target.value)} 
                    />
                </label>
                <label>
                    Days:
                    <input 
                        type="text" 
                        value={days}
                        onChange={e => setDays(e.target.value)} 
                    />
                </label>
                <label>
                    Start Time:
                    <input 
                        type="text" 
                        value={startTime}
                        placeholder="hh:mm AM/PM"
                        onChange={e => setStartTime(e.target.value)} 
                    />
                </label>
                <label>
                    End Time:
                    <input 
                        type="text" 
                        value={endTime}
                        placeholder="hh:mm AM/PM"
                        onChange={e => setEndTime(e.target.value)} 
                    />
                </label>
                <label>
                    Honors:
                    <input 
                        type="checkbox" 
                        checked={honors}
                        onChange={e => setHonors(e.target.checked)} 
                    />
                </label>
                <label>
                    Instructor:
                    <input 
                        type="text" 
                        value={instructor}
                        onChange={e => setInstructor(e.target.value)} 
                    />
                </label>
                <label>
                    Section:
                    <input 
                        type="text" 
                        value={section}
                        onChange={e => setSection(e.target.value)} 
                    />
                </label>
                <label>
                    Subject:
                    <input 
                        type="text" 
                        value={subject}
                        onChange={e => setSubject(e.target.value)} 
                    />
                </label>
                <label>
                    Subject Abbreviation:
                    <input 
                        type="text" 
                        value={subjectAbbreviation}
                        onChange={e => setSubjectAbbreviation(e.target.value)} 
                    />
                </label>
                <label>
                    Title:
                    <input 
                        type="text" 
                        value={title}
                        onChange={e => setTitle(e.target.value)} 
                    />
                </label>
                <button type="submit">Save Changes</button>
                <button type="button" onClick={onClose}>Cancel</button>
            </form>
        </div>
    );
}

export default EditClass;
