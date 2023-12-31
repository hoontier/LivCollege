import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeClass } from '../../features/classesSlice';
import EditClass from './EditClass'; 

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
    <div >
        <h3 >Your Classes</h3>
        <table >
            <thead >
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
                            <button  onClick={() => handleEditClass(data)}>Edit</button> {/* Button to open edit modal */}
                            <button  onClick={() => handleRemoveClass(data)}>Remove</button>
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
