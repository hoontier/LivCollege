//DisplayUserClasses.jsx
import React from 'react';
import { useSelector } from 'react-redux';

const DisplayUserClasses = () => {
  const userClasses = useSelector((state) => state.classes.userClasses);
  

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
            <tr key={index} >
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
    </div>
  );
}

export default DisplayUserClasses;
