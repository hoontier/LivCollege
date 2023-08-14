// FriendProfile.jsx
import React, { useEffect, useState } from 'react'; 
import { useSelector, useDispatch } from 'react-redux'; 
import { useParams } from 'react-router-dom';
import Header from '../components/HeaderAndFooter/Header';
import Footer from '../components/HeaderAndFooter/Footer';
import FriendClasses from '../components/Friends/FriendClasses';
import Schedule from '../components/Schedule';
import DisplayUserClasses from '../components/Classes/DisplayUserClasses';
import { setSelectedFriend } from '../features/friendsSlice'; 
import '../styles/ProfileStyles.css';

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
      <>
      <Header />  
      <div className="container">
          <h3 className="header-text">{friend.name} {friend.lastName}</h3>
          <p className="paragraph">Username: {friend.username}</p>
          <p className="paragraph">Bio: {friend.bio}</p>
          <FriendClasses />
          <button onClick={toggleUserClasses} className="toggle-button">
            {showUserClasses ? "Hide Your Classes" : "Show Your Classes"}
          </button>
          {showUserClasses && <DisplayUserClasses />}
          <Schedule showUserClasses={showUserClasses} />
          <Footer />
      </div>
    </>
    );
}

export default FriendProfile;
