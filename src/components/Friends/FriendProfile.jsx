// FriendProfile.jsx
import React, { useEffect, useState } from 'react'; 
import { useSelector, useDispatch } from 'react-redux'; 
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import { setSelectedFriend, removeFriend, sendFriendRequest } from '../../features/friendsSlice'; 
import { clearSelectedFriends } from '../../features/friendsSlice'; 


function FriendProfile({ friendId, onClose }) {
    const users = useSelector((state) => state.data.users);
    const [currentFriendData, setCurrentFriendData] = useState(0);
    const friends = useSelector((state) => state.friends.friends);
    const friend = friends.find(f => f.id === friendId);

    const dispatch = useDispatch();
    const userBeingViewed = users.find(user => user.id === friendId);

    const handleFriendRequest = () => {
        if (userBeingViewed) {
            console.log("Sending friend request to: ", userBeingViewed);
            dispatch(sendFriendRequest(userBeingViewed));
        }
    };


    const handleRemoveFriend = (friend) => {
      dispatch(removeFriend(friend));
    };

    useEffect(() => {
      const fetchFriendData = async () => {
          const friendDocRef = doc(db, "users", friendId);
          const friendSnapshot = await getDoc(friendDocRef);
          const updatedFriendData = friendSnapshot.data();
          console.log("updatedFriendData: ", updatedFriendData);
    
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

  const isFriend = !!friends.find(f => f.id === friendId);
  
  if (!isFriend) {
      return (
          <>
              <div>
                  <p>Add {currentFriendData?.username} as a Friend to View Profile</p>
                  <button onClick={handleFriendRequest}>Send Friend Request</button>
              </div>
          </>
      );
  }


    return (
      <>
          <div>
              <section>
              <button onClick={() => {onClose(); dispatch(clearSelectedFriends()); }}>←</button>
                  <div>
                      <img src={friend.photoURL} alt="profile picture" />
                  </div>
                  <section >
                      <div>
                          <h3 >{friend.name} {friend.lastName}</h3>
                          <button >Add To Group</button>
                          <button onClick={() => handleRemoveFriend(friend)} >Remove Friend</button>
                      </div>
                      <div >
                          <div >
                              <p>{currentFriendData?.friends?.length}</p>
                              <p>Friends</p>
                          </div>
                          <div >
                              <p>{friend.classes.length}</p>
                              <p>Classes</p>
                          </div>
                          <div>
                              <p>{friend.classes.reduce((acc, curr) => acc + curr.creditHours, 0)}</p>
                              <p>Credit Hours</p>
                          </div>
                      </div>
                      <div>
                          <p>{friend.username}</p>
                          <p >{friend.bio}</p>
                      </div>
                  </section>
              </section>
          </div>
      </>
  );
}

export default FriendProfile;
