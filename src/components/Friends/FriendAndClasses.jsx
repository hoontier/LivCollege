// FriendClasses.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedFriend } from '../../features/friendsSlice';

const FriendAndClasses = () => {
  const friends = useSelector((state) => state.friends.friends);
  const selectedFriend = useSelector((state) => state.friends.selectedFriend);
  const dispatch = useDispatch();

  const handleToggleClasses = (friend) => {
    if (selectedFriend && selectedFriend.id === friend.id) {
      dispatch(setSelectedFriend(null));
    } else {
      dispatch(setSelectedFriend(friend));
    }
  };

  return (
    <div>
      <h3>Your Friends</h3>
      {friends.map((friend, index) => (
        <div key={index}>
          <p>{friend.name}</p>
          <button onClick={() => handleToggleClasses(friend)}>Toggle Classes</button>
          {selectedFriend && selectedFriend.id === friend.id && (
            friend.classes && friend.classes.length > 0 ? (
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
                  {friend.classes.map((data, index) => (
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
            ) : (
              <p>User has no classes</p>
            )
          )}
        </div>
      ))}
    </div>
  );
}

export default FriendAndClasses;
