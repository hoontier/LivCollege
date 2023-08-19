//Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../config/firebaseConfig';
import { signOut } from 'firebase/auth';
import { useSelector } from 'react-redux';
import styles from "../../styles/HeaderStyles.module.css";

function Header() {
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const user = useSelector(state => state.data.user);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const signOutUser = () => {
        signOut(auth).then(() => {
            console.log("Sign-out successful.");
            navigate("/signin");
        }).catch((error) => {
            console.error("An error happened during sign-out:", error);
        });
    }

    const goToChangeClasses = () => {
        navigate("/change-classes");
    }

    const goToEditProfile = () => {
        navigate("/edit-profile");
    }

    const goToUserProfile = () => {
        navigate(`/user/${user.id}`);
    }

    const goToGroupsList = () => {
        navigate("/groups");
    }

    return (
        <div className={styles.header}>
            <h1 className={styles['header-title']} onClick={() => navigate("/home")}>liv.college</h1>
            <button onClick={() => navigate("/home")} className={styles['button-container']}>
                <img src="/icons/home.png" alt="Home" className={styles.icon} />
                Home
            </button>
            <button onClick={() => navigate("/friends")} className={styles['button-container']}>
                <img src="/icons/friends.png" alt="Friends" className={styles.icon} />
                Friends
            </button>
            <button className={styles['button-container']} title="View Groups" onClick={goToGroupsList}>
                <img src="/icons/people.png" alt="Groups" className={styles.icon} />
                Groups
            </button>
            <button onClick={handleDropdown} className={styles['button-container']} title="View Profile">
                <img src="/icons/user.png" alt="Profile" className={styles.icon} />
                Profile
            </button>
    
            {showDropdown && (
                <div ref={dropdownRef} className={styles.dropdown}>
                    <button className={styles['dropdown-button']} onClick={goToUserProfile}>View Profile</button>
                    <button className={styles['dropdown-button']} onClick={goToChangeClasses}>Edit Classes</button>
                    <button className={styles['dropdown-button']} onClick={goToEditProfile}>Edit Profile</button>
                    <button className={styles['dropdown-button']} onClick={signOutUser}>Sign Out</button>
                </div>
            )}
        </div>
    );    
}

export default Header;
