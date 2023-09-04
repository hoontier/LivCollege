// UserProfile.jsx
import React, { useEffect, useState } from 'react'; 
import { auth } from '../config/firebaseConfig';
import { useSelector, useDispatch } from 'react-redux'; 
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import Schedule from '../components/Schedule';
import DisplayUserClasses from '../components/Classes/DisplayUserClasses';

function UserProfile() {
    const user = useSelector(state => state.data.user);
    const navigate = useNavigate();

    const goToEditProfile = () => {
        navigate("/edit-profile");
    }

    const goToChangeClasses = () => {
        navigate("/change-classes");
    }

    useEffect(() => {
        console.log(auth.currentUser.photoURL)
    }, [])
    
    return (
        <>
            <Header />
            <div >
                <section >
                    <div >
                        <img src={user.photoURL} alt="profile picture" />
                    </div>
                    <section >
                        <div >
                            <h3 >{user.name} {user.lastName}</h3>
                            <button onClick={goToEditProfile}>Edit Profile</button>
                            <button onClick={goToChangeClasses}>Change Classes</button>
                        </div>
                        <div >
                            <div>
                                <p>{user.friends.length}</p>
                                <p>Friends</p>
                            </div>
                            <div>
                                <p>{user.classes.length}</p>
                                <p>Classes</p>
                            </div>
                            <div>
                                <p>{user.classes.reduce((acc, curr) => acc + curr.creditHours, 0)}</p>
                                <p>Credit Hours</p>
                            </div>
                        </div>
                        <div>
                            <p>{user.username}</p>
                            <p >{user.bio}</p>
                        </div>
                    </section>
                </section>
            </div>
            <div>
                <DisplayUserClasses />
            </div>
            <div>
                <Schedule />
            </div>
        </>
    );    
}

export default UserProfile;
