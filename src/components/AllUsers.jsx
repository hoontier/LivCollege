// AllUsers.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { sendFriendRequest, acceptRequest, rejectRequest, cancelRequest } from '../features/friendsSlice';
import { useDispatch } from 'react-redux';

const AllUsers = () => {
	const users = useSelector((state) => state.data.users);
	const userIncomingFriendRequests = useSelector((state) => state.friends.userIncomingFriendRequests);
	const userOutgoingFriendRequests = useSelector((state) => state.friends.userOutgoingFriendRequests);
	const dispatch = useDispatch();
	
	const sectionStyle = {
		display: 'flex',
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between'
	};
	
	const buttonStyle = {
		margin: '5px'
	};

	const handleFriendRequest = (user) => {
    dispatch(sendFriendRequest(user)); 
  };

	const handleAcceptRequest = (user) => {
		dispatch(acceptRequest(user));
	};

	const handleRejectRequest = (user) => {
		dispatch(rejectRequest(user));
	};

	const handleCancelRequest = (user) => {
		dispatch(cancelRequest(user));
	};


	return (
		<div>
			<h2>Users</h2>
			{/* <input
				type="text"
				placeholder="Search Users"
				value={searchTerm}
				onChange={handleSearchChange}
			/> */}
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
				{userIncomingFriendRequests.map((user, index) => (
					<div key={index}>
						<p>{user.username}</p>
						<button style={buttonStyle} onClick={() => handleAcceptRequest(user)}>Accept</button>
						<button style={buttonStyle} onClick={() => handleRejectRequest(user)}>Reject</button>
					</div>
				))}
			</div>

			<h2>Outgoing Requests</h2>
			<div style={sectionStyle}>
				{userOutgoingFriendRequests.map((user, index) => (
					<div key={index}>
						<p>{user.username}</p>
						<button style={buttonStyle} onClick={() => handleCancelRequest(user)}>Cancel Request</button>
					</div>
				))}
			</div>
		</div>
	);
}

export default AllUsers;