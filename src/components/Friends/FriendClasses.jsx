// FriendClasses.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import '../../styles/TableStyles.css'

const FriendClasses = () => {
  const selectedFriend = useSelector((state) => state.friends.selectedFriend);

  if (!selectedFriend || !selectedFriend.classes || selectedFriend.classes.length === 0) {
    return <p>User has no classes</p>;
  }

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
        </tr>
      </thead>
      <tbody>
        {selectedFriend.classes.map((data, index) => (
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
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default FriendClasses;
