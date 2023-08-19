import React from 'react';
import { useSelector } from 'react-redux';
import styles from '../../styles/TableStyles.module.css';  // Make sure this path is correct

const DisplayUserClasses = () => {
  const userClasses = useSelector((state) => state.classes.userClasses);

  return (
    <div>
        <h3>Your Classes</h3>
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
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  );
}

export default DisplayUserClasses;

