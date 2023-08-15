import React from 'react';
import { useSelector } from 'react-redux';
import '../../styles/TableStyles.css';  // Make sure this path is correct

const DisplayUserClasses = () => {
  const userClasses = useSelector((state) => state.classes.userClasses);

  return (
    <div>
      <h3>Your Classes</h3>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DisplayUserClasses;

