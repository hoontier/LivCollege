// FriendClasses.jsx
import React from 'react';

const FriendClasses = ({ friend }) => {  // <-- Accept a prop called friend

  if (!friend.classes || friend.classes.length === 0) {
    return <p>{friend.name} has no classes</p>;
  }

  return (
    <div>
        <h4>{friend.name}'s Classes:</h4>
        <table>
            <thead >
                <tr>
                    <th >Course</th>
                    <th >Title</th>
                    <th >Section</th>
                    <th >Days</th>
                    <th >Start Time</th>
                    <th >End Time</th>
                    <th >Credits</th>
                    <th >Honors</th>
                    <th >Instructor</th>
                </tr>
            </thead>
            <tbody>
                {friend.classes.map((data, index) => (
                    <tr key={index}>
                        <td >{data.course}</td>
                        <td >{data.title}</td>
                        <td >{data.section}</td>
                        <td >{data.days}</td>
                        <td >{data.startTime}</td>
                        <td >{data.endTime}</td>
                        <td >{data.creditHours}</td>
                        <td >{data.honors ? "Yes" : "No"}</td>
                        <td >{data.instructor}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  );
}

export default FriendClasses;
