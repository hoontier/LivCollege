// UsersAndRequests.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { sendFriendRequest, acceptRequest, rejectRequest, cancelRequest } from '../../features/friendsSlice';
import { useDispatch } from 'react-redux';

const UsersAndRequests = () => {
    const users = useSelector((state) => state.data.users);
    const userOutgoingFriendRequests = useSelector((state) => state.friends.userOutgoingFriendRequests);
	const userIncomingFriendRequests = useSelector((state) => state.friends.userIncomingFriendRequests);
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = React.useState('');
    const [displayedUsersCount, setDisplayedUsersCount] = React.useState(10); // Initial count of users displayed

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setDisplayedUsersCount(10);  // reset displayed count after a search
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


	// Filter users based on search term
	let filteredUsers = users.filter(user => user.username.toLowerCase().includes(searchTerm.toLowerCase()));

	// Get the users to display based on the current count
	const displayedUsers = filteredUsers.slice(0, displayedUsersCount);


	const containerStyle = {
		display: 'flex',
		justifyContent: 'space-between',
		fontFamily: 'sans-serif',
		padding: '0 20px',
		marginTop: "20px"
	};
	
	const sectionStyle = {
		flex: 1,
		margin: '0 10px',
		border: '1px solid black',   // Adding border to each section
		padding: '10px'   // Padding inside each section for better appearance
	};
	
	const userStyle = {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: "10px"
	};
	
	const buttonStyle = {
		marginLeft: '10px'
	};


	return (
		<div style={containerStyle}>
			<div style={sectionStyle}>
				<h2>Users</h2>
				<input
					type="text"
					placeholder="Search Users"
					value={searchTerm}
					onChange={handleSearchChange}
				/>
				{displayedUsers.map((user, index) => (
					<div key={index} style={userStyle}>
						<img src={user.photoURL} alt="avatar" width="50" height="50" style={{borderRadius: "50%", marginRight: "10px"}}/>
						<p>{user.username}</p>
						<button style={buttonStyle} onClick={() => handleFriendRequest(user)}>Add Friend</button>
					</div>
				))}
				{displayedUsersCount < filteredUsers.length && ( 
					<button onClick={() => setDisplayedUsersCount(displayedUsersCount + 10)}>
						Load More Users
					</button>
				)}
			</div>
	
			<div style={sectionStyle}>
				<h2>Friend Requests</h2>
				{userIncomingFriendRequests.map((user, index) => (
					<div key={index} style={userStyle}>
						<img src={user.photoURL} alt="avatar" width="50" height="50" style={{borderRadius: "50%", marginRight: "10px"}}/>
						<p>{user.username}</p>
						<button style={buttonStyle} onClick={() => handleAcceptRequest(user)}>Accept</button>
						<button style={buttonStyle} onClick={() => handleRejectRequest(user)}>Reject</button>
					</div>
				))}
			</div>
	
			<div style={sectionStyle}>
				<h2>Outgoing Requests</h2>
				{userOutgoingFriendRequests.map((user, index) => (
					<div key={index} style={userStyle}>
						<img src={user.photoURL} alt="avatar" width="50" height="50" style={{borderRadius: "50%", marginRight: "10px"}}/>
						<p>{user.username}</p>
						<button style={buttonStyle} onClick={() => handleCancelRequest(user)}>Cancel Request</button>
					</div>
				))}
			</div>
		</div>
	);
}

export default UsersAndRequests;