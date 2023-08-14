// FriendClasses.jsx
import React from 'react';
import { useSelector } from 'react-redux';

const FriendClasses = () => {
  const selectedFriend = useSelector((state) => state.friends.selectedFriend);

  if (!selectedFriend || !selectedFriend.classes || selectedFriend.classes.length === 0) {
    return <p>User has no classes</p>;
  }

  return (
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
        {selectedFriend.classes.map((data, index) => (
          <tr key={index}>
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
  );
}

export default FriendClasses;
