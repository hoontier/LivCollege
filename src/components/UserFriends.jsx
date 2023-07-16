import React from 'react';

function UserFriends({ friends }) {
  return (
    <div>
      <h2>Your Friends</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
          </tr>
        </thead>
        <tbody>
          {friends.map((friend) => (
            <tr key={friend.id}>
              <td>{friend.name}</td>
              <td>{friend.username}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserFriends;
