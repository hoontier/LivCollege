//UserClasses.jsx
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

  const userClassesStyles = {
    container: {
      marginTop: '20px'
    },
    headerText: {
      fontSize: '22px',
      fontWeight: 'bold',
      marginBottom: '15px'
    },
    button: {
      margin: '5px',
      padding: '7px 12px',
      backgroundColor: '#4CAF50',
      border: 'none',
      color: '#fff',
      cursor: 'pointer'
    },
    removeButton: {
      backgroundColor: '#f44336'
    }
  };

  const tableStyles = {
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginBottom: '20px',
      border: '1px solid #ddd',  // Border for the whole table
    },
    header: {
      backgroundColor: '#e7e7e7'  // Slightly different color for headers
    },
    cell: {
      border: '1px solid #ddd',  // Border for individual cells
      padding: '8px'
    }
  };

  return (
    <div style={userClassesStyles.container}>
      <h3 style={userClassesStyles.headerText}>Your Classes</h3>
        <table style={tableStyles.table}>
        <thead>
          <tr>
            <th>Course</th>
            <th>Title</th>
            <th>Section</th>
            <th>Days</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Credits</th>
            <th>Honors</th>
            <th>Instructor</th>
            <th>Actions</th> {/* New column for actions */}
          </tr>
        </thead>
        <tbody>
          {userClasses.map((data, index) => (
            <tr key={index}>
              <td>{data.course}</td>
              <td>{data.title}</td>
              <td>{data.section}</td>
              <td>{data.days}</td>
              <td>{data.startTime}</td>
              <td>{data.endTime}</td>
              <td>{data.creditHours}</td>
              <td>{data.honors ? "Yes" : "No"}</td>
              <td>{data.instructor}</td>
              <td>
                <button onClick={() => handleEditClass(data)}>Edit</button> {/* Button to open edit modal */}
                <button onClick={() => handleRemoveClass(data)}>Remove</button>
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
