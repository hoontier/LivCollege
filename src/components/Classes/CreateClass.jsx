import React, { useState } from 'react';
import { db } from '../../config/firebaseConfig';
import { addDoc, doc, collection, updateDoc, arrayUnion } from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { addClass } from '../../features/classesSlice';

function CreateClass() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.data.user);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const newClassData = {
            course,
            courseNumber,
            creditHours: parseInt(creditHours),  // Convert creditHours to integer
            days,
            endTime,
            honors,
            instructor,
            section,
            startTime,
            subject,
            subjectAbbreviation,
            title
        };
    
        // Add the class to Firestore's classes collection
        const classRef = await addDoc(collection(db, 'classes'), newClassData);
    
        // Add the Firestore ID to our new class data
        newClassData.id = classRef.id;
    
        // Update user's Firestore document with the new class data that includes the Firestore ID
        const userRef = doc(db, 'users', user.id);
        await updateDoc(userRef, {
            classes: arrayUnion(newClassData)
        });
    
        // Update the local Redux store
        dispatch(addClass(newClassData));
    };
    
    

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
                <button type="submit">Create Class</button>
            </form>
        </div>
    );
}

export default CreateClass;
