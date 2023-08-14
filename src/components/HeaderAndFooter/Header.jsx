import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../config/firebaseConfig';
import { signOut } from 'firebase/auth';

function Header() {
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

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

    const goToSetup = () => {
        navigate("/setup");
    }

    const headerStyle = {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: '60px',
        maxWidth: '100%',
        background: '#f5f5f5',
        boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
        padding: '5px 20px',
    };

    const iconStyle = {
        width: '30px',
        height: '30px',
        cursor: 'pointer',
    };

    const dropdownStyle = {
        position: 'absolute',
        top: '60px',
        right: '20px',
        background: '#fff',
        boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.2)',
        border: '1px solid #e0e0e0',
        borderRadius: '4px',
    };

    const dropdownButtonStyle = {
        display: 'block',
        width: '100%',
        padding: '8px 12px',
        border: 'none',
        borderBottom: '1px solid #e0e0e0',
        background: 'none',
        cursor: 'pointer',
        textAlign: 'left',
    };
    const buttonContainerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'none',
        border: 'none',
        fontSize: '12px',
        fontFamily: 'sans-serif',
        cursor: 'pointer',
    };

    return (
        <div style={headerStyle}>
            <h1 style={{ fontFamily: "sans-serif", cursor: 'pointer' }} onClick={() => navigate("/home")}>liv.college</h1>
            <button onClick={() => navigate("/home")} style={buttonContainerStyle}>
                <img src="/icons/home.png" alt="Home" style={iconStyle} />
                Home
            </button>
            <button onClick={() => navigate("/friends")} style={buttonContainerStyle}>
                <img src="/icons/friends.png" alt="Friends" style={iconStyle} />
                Friends
            </button>
            <div style={buttonContainerStyle} title="View Groups">
                <img src="/icons/people.png" alt="Groups" style={iconStyle} />
                Groups
            </div>
            <div style={buttonContainerStyle} title="More Options">
                <img src="/icons/more.png" alt="Add" style={iconStyle} />
                Options
            </div>
            <button onClick={handleDropdown} style={buttonContainerStyle} title="View Profile">
                <img src="/icons/user.png" alt="Profile" style={iconStyle} />
                Profile
            </button>

            {showDropdown && (
                <div ref={dropdownRef} style={dropdownStyle}>
                    <button style={dropdownButtonStyle} onClick={signOutUser}>Sign Out</button>
                    <button style={dropdownButtonStyle} onClick={goToSetup}>Edit Profile and Classes</button>
                </div>
            )}
        </div>
    );
}

export default Header;
