import React from 'react';

const Users = ({ users, userFriendRequests, userOutgoingRequests, handleFriendRequest, handleAcceptRequest, handleRejectRequest, handleCancelRequest }) => {

    
    const sectionStyle = {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
      };
    
      const buttonStyle = {
        margin: '5px'
      };
    
      return (
        <div>
          <h2>Users</h2>
          <div style={sectionStyle}>
            {users.map((user, index) => (
              <div key={index}>
                <p>{user.username}</p>
                <button style={buttonStyle} onClick={() => handleFriendRequest(user)}>Add Friend</button>
              </div>
            ))}
          </div>
    
          <h2>Friend Requests</h2>
          <div style={sectionStyle}>
            {userFriendRequests.map((user, index) => (
              <div key={index}>
                <p>{user.username}</p>
                <button style={buttonStyle} onClick={() => handleAcceptRequest(user)}>Accept</button>
                <button style={buttonStyle} onClick={() => handleRejectRequest(user)}>Reject</button>
              </div>
            ))}
          </div>
    
          <h2>Outgoing Requests</h2>
          <div style={sectionStyle}>
            {userOutgoingRequests.map((user, index) => (
              <div key={index}>
                <p>{user.username}</p>
                <button style={buttonStyle} onClick={() => handleCancelRequest(user)}>Cancel Request</button>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    export default Users;