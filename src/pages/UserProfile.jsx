// UserProfile.jsx
import React, { useEffect, useState } from 'react'; 
import { auth } from '../config/firebaseConfig';
import { useSelector, useDispatch } from 'react-redux'; 
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/HeaderAndFooter/Header';
import Footer from '../components/HeaderAndFooter/Footer';
import Schedule from '../components/Schedule';
import DisplayUserClasses from '../components/Classes/DisplayUserClasses';
import styles from '../styles/ProfileStyles.module.css';

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
            <div className={styles.container}>
                <section className={styles.profile}>
                    <div className={styles['profile-picture']}>
                        <img src={user.photoURL} alt="profile picture" />
                    </div>
                    <section className={styles['personal-info']}>
                        <div className={styles['name-and-buttons']}>
                            <h3 className={styles['header-text']}>{user.name} {user.lastName}</h3>
                            <button className={styles.button} onClick={goToEditProfile}>Edit Profile</button>
                            <button className={styles.button} onClick={goToChangeClasses}>Change Classes</button>
                        </div>
                        <div className={styles.stats}>
                            <div className={styles.stat}>
                                <p>{user.friends.length}</p>
                                <p>Friends</p>
                            </div>
                            <div className={styles.stat}>
                                <p>{user.classes.length}</p>
                                <p>Classes</p>
                            </div>
                            <div className={styles.stat}>
                                <p>{user.classes.reduce((acc, curr) => acc + curr.creditHours, 0)}</p>
                                <p>Credit Hours</p>
                            </div>
                        </div>
                        <div className={styles.personals}>
                            <p className={styles.username}>{user.username}</p>
                            <p className={styles.bio}>{user.bio}</p>
                        </div>
                    </section>
                </section>
            </div>
            <div className={styles.table}>
                <DisplayUserClasses />
            </div>
            <div className={styles.schedule}>
                <Schedule />
            </div>
            <Footer />
        </>
    );    
}

export default UserProfile;
