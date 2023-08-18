import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeClass } from '../../features/classesSlice';
import EditClass from './EditClass'; 
import '../../styles/TableStyles.css';

const UserClasses = () => {
  const dispatch = useDispatch();
  const userClasses = useSelector((state) => state.classes.userClasses);
  const user = useSelector((state) => state.data.user);
  
  const [selectedClass, setSelectedClass] = useState(null); // This will be used to determine which class to edit
  
  const handleRemoveClass = (data) => {
    dispatch(removeClass({ user: user, classId: data.id }));
  };
  
  const handleEditClass = (data) => {
    setSelectedClass(data);
  };

  const closeEditModal = () => {
    setSelectedClass(null);
  };

  return (
    <div className="user-classes-container">
      <h3 className="main-header-text">Your Classes</h3>
        <table className="table">
        <thead className="table-header">
          <tr>
            <th className="table-cell">Course</th>
            <th className="table-cell">Title</th>
            <th className="table-cell">Section</th>
            <th className="table-cell">Days</th>
            <th className="table-cell">Start Time</th>
            <th className="table-cell">End Time</th>
            <th className="table-cell">Credits</th>
            <th className="table-cell">Honors</th>
            <th className="table-cell">Instructor</th>
            <th className="table-cell">Actions</th> {/* New column for actions */}
          </tr>
        </thead>
        <tbody>
          {userClasses.map((data, index) => (
            <tr key={index}>
              <td className="table-cell">{data.course}</td>
              <td className="table-cell">{data.title}</td>
              <td className="table-cell">{data.section}</td>
              <td className="table-cell">{data.days}</td>
              <td className="table-cell">{data.startTime}</td>
              <td className="table-cell">{data.endTime}</td>
              <td className="table-cell">{data.creditHours}</td>
              <td className="table-cell">{data.honors ? "Yes" : "No"}</td>
              <td className="table-cell">{data.instructor}</td>
              <td className="table-cell">
                <button className="button" onClick={() => handleEditClass(data)}>Edit</button> {/* Button to open edit modal */}
                <button className="button remove-button" onClick={() => handleRemoveClass(data)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedClass && <EditClass classData={selectedClass} onClose={closeEditModal} />} {/* This displays the edit modal if a class is selected */}
    </div>
  );
}

export default UserClasses;
