// FriendProfile.jsx
import React, { useEffect, useState } from 'react'; 
import { useSelector, useDispatch } from 'react-redux'; 
import { useParams } from 'react-router-dom';
import Header from '../components/HeaderAndFooter/Header';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import Footer from '../components/HeaderAndFooter/Footer';
import FriendClasses from '../components/Friends/FriendClasses';
import Schedule from '../components/Schedule';
import DisplayUserClasses from '../components/Classes/DisplayUserClasses';
import { setSelectedFriend, removeFriend } from '../features/friendsSlice'; 
import styles from '../styles/ProfileStyles.module.css';

function FriendProfile() {
    const [currentFriendData, setCurrentFriendData] = useState(0);
    const { friendId } = useParams(); 
    const friends = useSelector((state) => state.friends.friends);
    const friend = friends.find(f => f.id === friendId);
    const dispatch = useDispatch();

    // Local state for toggle
    const [showUserClasses, setShowUserClasses] = useState(false);
  
    const toggleUserClasses = () => {
      setShowUserClasses(prev => !prev);
    }

    const handleRemoveFriend = (friend) => {
      dispatch(removeFriend(friend));
    };

    useEffect(() => {
      const fetchFriendData = async () => {
          const friendDocRef = doc(db, "users", friendId);
          const friendSnapshot = await getDoc(friendDocRef);
          const updatedFriendData = friendSnapshot.data();
    
          if (updatedFriendData) {
              setCurrentFriendData(updatedFriendData);
              dispatch(setSelectedFriend(updatedFriendData));
          }
      };
    
      fetchFriendData();
    
      return () => {
        dispatch(setSelectedFriend([]));
      };
  }, [friendId, dispatch]);
  

    if (!friend) return <p>Friend not found</p>;


    return (
      <>
          <Header />
          <div className={styles.container}>
              <section className={styles.profile}>
                  <div className={styles['profile-picture']}>
                      <img src={friend.photoURL} alt="profile picture" />
                  </div>
                  <section className={styles['personal-info']}>
                      <div className={styles['name-and-buttons']}>
                          <h3 className={styles['header-text']}>{friend.name} {friend.lastName}</h3>
                          <button className={styles.button}>Add To Group</button>
                          <button onClick={() => handleRemoveFriend(friend)} className={styles.button}>Remove Friend</button>
                      </div>
                      <div className={styles.stats}>
                          <div className={styles.stat}>
                              <p>{currentFriendData?.friends?.length}</p>
                              <p>Friends</p>
                          </div>
                          <div className={styles.stat}>
                              <p>{friend.classes.length}</p>
                              <p>Classes</p>
                          </div>
                          <div className={styles.stat}>
                              <p>{friend.classes.reduce((acc, curr) => acc + curr.creditHours, 0)}</p>
                              <p>Credit Hours</p>
                          </div>
                      </div>
                      <div className={styles.personals}>
                          <p className={styles.username}>{friend.username}</p>
                          <p className={styles.bio}>{friend.bio}</p>
                      </div>
                  </section>
              </section>
          </div>
          <div className={styles.table}>
              <FriendClasses friend={friend} />
          </div>
          <button onClick={toggleUserClasses} className={styles['toggle-button']}>
              {showUserClasses ? "Hide Your Classes" : "Show Your Classes"}
          </button>
          {showUserClasses && <div className={styles.table}><DisplayUserClasses /></div>}
          <div className={styles.schedule}>
              <Schedule showUserClasses={showUserClasses} />
          </div>
          <Footer />
      </>
  );
}

export default FriendProfile;
