import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BottomNav from '../components/BottomNav'; // 프로젝트 구조에 따라 경로 확인
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// 로그아웃, 사용자 아이콘
import { faArrowRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons';

import './Profile.css';

// 사용자 정보의 기본값 설정 (실제 데이터를 불러오기 전)
const initialUserData = {
    username: '이름',
    completionRate: '0%', // 기본값
    followers: 0, // 기본값
};

export default function Profile({ setTab }) {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('created');
    const [userInfo, setUserInfo] = useState(initialUserData);

    // 1. 사용자 정보 불러오기 (Axios 사용)
    useEffect(() => {
        const loadUserInfo = async () => {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                console.warn('❌ accessToken이 없어 사용자 정보를 불러올 수 없습니다.');
                // navigate("/login");
                return;
            }

            try {
                const response = await axios.get('http://127.0.0.1:3000/api/user/me', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                if (response.data?.username) {
                    setUserInfo({
                        username: response.data.username,
                        // 서버 응답 데이터 구조에 맞게 수정해주세요.
                        completionRate: response.data.completionRate || '0%',
                        followers: response.data.followers || 0,
                    });
                } else {
                    console.warn('사용자 정보를 불러오지 못했습니다. 데이터:', response.data);
                }
            } catch (err) {
                console.error('❌ 사용자 정보 요청 실패:', err);
                // 토큰 만료 등 오류 발생 시 로그아웃 처리 등을 고려
            }
        };
        loadUserInfo();
    }, []);

    // 2. 로그아웃 처리 (Axios 사용)
    const handleLogout = async () => {
        const confirmLogout = window.confirm('로그아웃하시겠습니까?');
        if (!confirmLogout) return;

        try {
            await axios.post('http://127.0.0.1:3000/api/auth/logout', {}, { withCredentials: true });
        } catch (err) {
            console.error('❌ 로그아웃 요청 실패:', err);
        }

        // 클라이언트 측 정보 삭제 및 리디렉션
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        navigate('/login');
    };

    return (
        <div className="profile-container">
            {/* 상단 로그아웃 버튼 */}
            <span className="logout-btn" onClick={handleLogout}>
                <FontAwesomeIcon icon={faArrowRightFromBracket} />
            </span>

            {/* 프로필 영역: 이름, 통계 (좌) / 아이콘 (우) */}
            <div className="profile-content">
                <div className="profile-info">
                    <span className="profile-name">{userInfo.username}</span>
                    <div className="profile-stats">
                        <span className="stat-item">달성률 {userInfo.completionRate}</span>
                        <span className="stat-item">팔로워 {userInfo.followers}명</span>
                    </div>
                </div>
                {/* ⭐️ 수정: profile-icon div 안에 FontAwesomeIcon을 배치하여 원형 배경 스타일을 적용합니다. ⭐️ */}
                <div className="profile-icon">
                    <FontAwesomeIcon icon={faUser} />
                </div>
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
                <p style={{ padding: '20px', textAlign: 'center', color: '#aaa', fontWeight: 500 }}>
                    {activeTab === 'created' ? '생성한 챌린지 목록' : '참여 중인 챌린지 목록'}
                </p>
            </div>

            {/* 하단 네비게이션 */}
            <BottomNav setTab={setTab} />
        </div>
    );
}
