// FriendClasses.jsx
import React from 'react';

const FriendClasses = ({ friendClasses }) => {
    return (
        <div>
            <h2>Friend's Classes</h2>
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
                    {friendClasses.map((data, index) => (
                    <tr key={index} onClick={() => handleRemoveClass(data)} style={{cursor: 'pointer'}}>
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
};

export default FriendClasses;
