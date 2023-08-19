// FriendClasses.jsx
import React from 'react';
import styles from '../../styles/TableStyles.module.css'

const FriendClasses = ({ friend }) => {  // <-- Accept a prop called friend

  if (!friend.classes || friend.classes.length === 0) {
    return <p>{friend.name} has no classes</p>;
  }

  return (
    <div>
        <h4>{friend.name}'s Classes:</h4>
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
                {friend.classes.map((data, index) => (
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

export default FriendClasses;
