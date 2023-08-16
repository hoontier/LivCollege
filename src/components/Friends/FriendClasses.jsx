// FriendClasses.jsx
import React from 'react';
import '../../styles/TableStyles.css'

const FriendClasses = ({ friend }) => {  // <-- Accept a prop called friend

  if (!friend.classes || friend.classes.length === 0) {
    return <p>{friend.name} has no classes</p>;
  }

  return (
    <div>
      <h4>{friend.name}'s Classes:</h4>
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
          {friend.classes.map((data, index) => (
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
    </div>
  );
}

export default FriendClasses;
