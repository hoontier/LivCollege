import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeClass } from '../../features/classesSlice';
import EditClass from './EditClass'; 
import styles from '../../styles/TableStyles.module.css';

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
    <div className={styles['user-classes-container']}>
        <h3 className={styles['main-header-text']}>Your Classes</h3>
        <table className={styles.table}>
            <thead className={styles['table-header']}>
                <tr>
                    <th className={styles['table-cell']}>Course</th>
                    <th className={styles['table-cell']}>Title</th>
                    <th className={styles['table-cell']}>Section</th>
                    <th className={styles['table-cell']}>Days</th>
                    <th className={styles['table-cell']}>Start Time</th>
                    <th className={styles['table-cell']}>End Time</th>
                    <th className={styles['table-cell']}>Credits</th>
                    <th className={styles['table-cell']}>Honors</th>
                    <th className={styles['table-cell']}>Instructor</th>
                    <th className={styles['table-cell']}>Actions</th> {/* New column for actions */}
                </tr>
            </thead>
            <tbody>
                {userClasses.map((data, index) => (
                    <tr key={index}>
                        <td className={styles['table-cell']}>{data.course}</td>
                        <td className={styles['table-cell']}>{data.title}</td>
                        <td className={styles['table-cell']}>{data.section}</td>
                        <td className={styles['table-cell']}>{data.days}</td>
                        <td className={styles['table-cell']}>{data.startTime}</td>
                        <td className={styles['table-cell']}>{data.endTime}</td>
                        <td className={styles['table-cell']}>{data.creditHours}</td>
                        <td className={styles['table-cell']}>{data.honors ? "Yes" : "No"}</td>
                        <td className={styles['table-cell']}>{data.instructor}</td>
                        <td className={styles['table-cell']}>
                            <button className={styles.button} onClick={() => handleEditClass(data)}>Edit</button> {/* Button to open edit modal */}
                            <button className={styles['remove-button']} onClick={() => handleRemoveClass(data)}>Remove</button>
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
