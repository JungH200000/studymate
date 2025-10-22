import React from 'react';
import { useNavigate } from 'react-router-dom';
import home from '../assets/icons/home.png';
import write from '../assets/icons/write.png';
import user from '../assets/icons/user.png';

import './BottomNav.css';

export default function BottomNav() {
    const navigate = useNavigate();

    return (
        <div className="bottom-nav">
            <button onClick={() => navigate('/home')}>
                <img src={home} alt="home" width={24} height={24} />
            </button>
            <button onClick={() => navigate('/write')}>
                <img src={write} alt="write" width={24} height={24} />
            </button>
            <button onClick={() => navigate('/profile')}>
                <img src={user} alt="user" width={24} height={24} />
            </button>
        </div>
    );
}
