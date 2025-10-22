import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons';

import './Profile.css';

export default function Profile({ setTab }) {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('created');

    const handleLogout = () => {
        if (window.confirm('로그아웃하시겠습니까?')) {
            localStorage.removeItem('user');
            navigate('/login');
        }
    };

    const userData = localStorage.getItem('user');
    let nickname = 'User Name';
    let completionRate = '52%';
    let followers = 0;

    if (userData) {
        try {
            const user = JSON.parse(userData);
            nickname = user.username || 'User Name';
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="profile-container">
            {/* 상단 로그아웃 버튼 */}
            <span className="logout-btn" onClick={handleLogout}>
                <FontAwesomeIcon icon={faArrowRightFromBracket} size="lg" />
            </span>

            {/* 프로필 영역 */}
            <div className="profile-content">
                <div className="profile-info">
                    <span className="profile-name">{nickname}</span>
                    <div className="profile-stats">
                        <span className="stat-item">달성률 {completionRate}</span>
                        <span className="stat-item">팔로워 {followers}명</span>
                    </div>
                </div>
                <FontAwesomeIcon icon={faUser} size="6x" className="profile-icon" />
            </div>

            {/* 챌린지 탭 내비게이션 */}
            <div className="challenge-tabs">
                <div
                    className={`tab-item ${activeTab === 'created' ? 'active' : ''}`}
                    onClick={() => setActiveTab('created')}
                >
                    생성 챌린지
                </div>
                <div
                    className={`tab-item ${activeTab === 'joined' ? 'active' : ''}`}
                    onClick={() => setActiveTab('joined')}
                >
                    참여 챌린지
                </div>
            </div>

            {/* 챌린지 목록 (생략) */}
            <div className="challenge-list-container">
                <p style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                    {activeTab === 'created' ? '생성한 챌린지 목록' : '참여 중인 챌린지 목록'}
                </p>
            </div>

            {/* 하단 네비게이션 */}
            <BottomNav setTab={setTab} />
        </div>
    );
}
