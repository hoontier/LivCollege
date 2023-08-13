//UserClasses.jsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeClass } from '../features/classesSlice';

const UserClasses = ({ onBack, onNext }) => {
  const dispatch = useDispatch();
  const userClasses = useSelector((state) => state.classes.userClasses);
  const user = useSelector((state) => state.data.user);

  const handleRemoveClass = (data) => {
    dispatch(removeClass({ user: user, classId: data.id }));
  };
  

  return (
    <div>
      <h3>Your Classes</h3>
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
            <tr key={index} onClick={() => handleRemoveClass(data)} style={{cursor: 'pointer'}}>
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
      <button onClick={onBack}>Edit Personal Info</button>
      <button onClick={onNext}>Continue Setup</button>
    </div>
  );
}

export default UserClasses;
