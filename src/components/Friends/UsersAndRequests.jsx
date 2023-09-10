// UsersAndRequests.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { sendFriendRequest, acceptRequest, rejectRequest, cancelRequest } from '../../features/friendsSlice';
import { useDispatch } from 'react-redux';
import styles from '../../styles/UsersAndRequests.module.css';

const UsersAndRequests = ({ onHide }) => {
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
		console.log("Sending friend request to ID: ", user);
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




	return (
		<div>
			<button className={styles.backButton} onClick={onHide}>Back</button>
			<div className={styles.container}>
				<div className={styles.section}>
					<h2>Users</h2>
					<input
						type="text"
						placeholder="Search Users"
						value={searchTerm}
						onChange={handleSearchChange}
					/>
					{displayedUsers.map((user, index) => (
						<div key={index} className={styles.user}>
							<img src={user.photoURL} alt="avatar" className={styles.avatar}/>
							<p>{user.username}</p>
							<button className={styles.button} onClick={() => handleFriendRequest(user)}>Add Friend</button>
						</div>
					))}
					{displayedUsersCount < filteredUsers.length && ( 
						<button onClick={() => setDisplayedUsersCount(displayedUsersCount + 10)}>
							Load More Users
						</button>
					)}
				</div>
		
				<div className={styles.section}>
					<h2>Friend Requests</h2>
					{userIncomingFriendRequests.map((user, index) => (
						<div key={index} className={styles.user}>
							<img src={user.photoURL} alt="avatar" className={styles.avatar}/>
							<p>{user.username}</p>
							<button className={styles.button} onClick={() => handleAcceptRequest(user)}>Accept</button>
							<button className={styles.button} onClick={() => handleRejectRequest(user)}>Reject</button>
						</div>
					))}
				</div>
		
				<div className={styles.section}>
					<h2>Outgoing Requests</h2>
					{userOutgoingFriendRequests.map((user, index) => (
						<div key={index} className={styles.user}>
							<img src={user.photoURL} alt="avatar" className={styles.avatar}/>
							<p>{user.username}</p>
							<button className={styles.button} onClick={() => handleCancelRequest(user)}>Cancel Request</button>
						</div>
					))}
				</div>
			</div>
		</div>
	);
	
}

export default UsersAndRequests;