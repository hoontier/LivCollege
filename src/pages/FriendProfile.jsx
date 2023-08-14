import React, { useEffect, useState } from 'react'; // Import useEffect
import { useSelector, useDispatch } from 'react-redux'; // Import useDispatch
import { useParams } from 'react-router-dom';
import Header from '../components/HeaderAndFooter/Header';
import Footer from '../components/HeaderAndFooter/Footer';
import FriendClasses from '../components/Friends/FriendClasses';
import Schedule from '../components/Schedule';
import UserClasses from '../components/Classes/UserClasses';
import { setSelectedFriend } from '../features/friendsSlice'; // Import the action


function FriendProfile() {
    const { friendId } = useParams(); 
    const friends = useSelector((state) => state.friends.friends);
    const friend = friends.find(f => f.id === friendId);
    const dispatch = useDispatch();

    // Local state for toggle
    const [showUserClasses, setShowUserClasses] = useState(false);
  
    const toggleUserClasses = () => {
      setShowUserClasses(prev => !prev);
    }

    useEffect(() => {
      dispatch(setSelectedFriend(friend));
      return () => {
        dispatch(setSelectedFriend(null));
      };
    }, [friend, dispatch]);

    if (!friend) return <p>Friend not found</p>;

    return (
        <div>
            <Header />
            <h3>{friend.name} {friend.lastName}</h3>
            <p>Username: {friend.username}</p>
            <p>Bio: {friend.bio}</p>
            <FriendClasses />
            <button onClick={toggleUserClasses}>
              {showUserClasses ? "Hide Your Classes" : "Show Your Classes"}
            </button>
            {showUserClasses && <UserClasses />} {/* Conditional Rendering */}
            <Schedule showUserClasses={showUserClasses} /> {/* Pass prop to Schedule */}
            <Footer />
        </div>
    );
}

export default FriendProfile;
