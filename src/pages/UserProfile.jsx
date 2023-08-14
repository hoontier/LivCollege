// UserProfile.jsx
import React, { useEffect, useState } from 'react'; 
import { auth } from '../config/firebaseConfig';
import { useSelector, useDispatch } from 'react-redux'; 
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/HeaderAndFooter/Header';
import Footer from '../components/HeaderAndFooter/Footer';
import Schedule from '../components/Schedule';
import DisplayUserClasses from '../components/Classes/DisplayUserClasses';
import '../styles/ProfileStyles.css';

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
      <div className="container">
        <section className="profile"> 
        <div className="profile-picture">
            <img src={user.photoURL} alt="profile picture" />
        </div>
        <section className="personal-info">
            <div className="name-and-buttons">
            <h3 className="header-text">{user.name} {user.lastName}</h3>
            <button className="button" onClick={goToEditProfile}>Edit Profile</button>
            <button className="button" onClick={goToChangeClasses}>Change Classes</button>
            </div>
            <div className="stats">
                <div className="stat">
                    <p>{user.friends.length}</p>
                    <p>Friends</p>
                </div>
                <div className="stat">
                    <p>{user.classes.length}</p>
                    <p>Classes</p>
                </div>
                {/* add up all the creditHours in the user's classes */}
                <div className="stat">
                    <p>{user.classes.reduce((acc, curr) => acc + curr.creditHours, 0)}</p>
                    <p>Credit Hours</p>
                </div>
            </div>
            <div className="personals">
            <p className="username">{user.username}</p>
            <p className="bio">{user.bio}</p>

            </div>
            </section>
        </section>
      </div>
    <div className="table">
      <DisplayUserClasses />
    </div>
    <div className="schedule">
      <Schedule />
    </div>
    <Footer />
    </>
    );
}

export default UserProfile;
