import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { sendFriendRequest, cancelRequest } from '../../features/friendsSlice';

const SetupFriends = ({ onBack, onNext }) => {
    const users = useSelector((state) => state.data.users);
    const userOutgoingFriendRequests = useSelector((state) => state.friends.userOutgoingFriendRequests);
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
		marginBottom: '10px'
	};
	
	const buttonStyle = {
		marginLeft: '10px'
	};


	return (
		<>
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
				<h2>Outgoing Requests</h2>
				{userOutgoingFriendRequests.map((user, index) => (
					<div key={index} style={userStyle}>
						<p>{user.username}</p>
						<button style={buttonStyle} onClick={() => handleCancelRequest(user)}>Cancel Request</button>
					</div>
				))}
			</div>
        </div>
        <div>
			<button onClick={onBack}>Add/Remove Classes</button>
            <button onClick={onNext}>Finish Setup</button>
        </div>
        </>
    );
}

export default SetupFriends;
