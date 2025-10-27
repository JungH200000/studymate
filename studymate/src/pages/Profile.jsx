import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BottomNav from '../components/BottomNav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons';
// 기존 fetchWithAuth 대신 axios를 사용하므로 해당 import는 제거합니다.
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
            // accessToken을 사용하여 인증이 필요한 요청
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                console.warn('❌ accessToken이 없어 사용자 정보를 불러올 수 없습니다.');
                // 로그인 페이지로 리디렉션 등을 고려할 수 있습니다.
                // navigate("/login");
                return;
            }

            try {
                const response = await axios.get('http://127.0.0.1:3000/api/user/me', {
                    headers: {
                        // Bearer 토큰을 사용하여 인증 정보를 전달
                        Authorization: `Bearer ${accessToken}`,
                    },
                    // withCredentials는 쿠키 기반 인증 시 사용되지만, 토큰 기반 인증이므로 필요 없을 수 있습니다.
                    // 서버 설정에 따라 필요할 수도 있습니다.
                    // withCredentials: true,
                });

                if (response.data?.username) {
                    // 서버에서 받아온 데이터로 상태 업데이트
                    // 예시: 서버 응답에 completionRate와 followers가 있다고 가정
                    setUserInfo({
                        username: response.data.username,
                        // 예시로 서버 응답 데이터 구조에 맞게 수정해주세요.
                        completionRate: response.data.completionRate || '0%',
                        followers: response.data.followers || 0,
                    });
                } else {
                    console.warn('사용자 정보를 불러오지 못했습니다. 데이터:', response.data);
                    // 서버에서 사용자 정보를 못 받은 경우 기본값 유지
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
            // 서버에 로그아웃 요청 (세션/쿠키 무효화 등)
            await axios.post(
                'http://127.00.0.1:3000/api/auth/logout',
                {},
                { withCredentials: true } // 서버에서 세션 쿠키를 지우는 경우 필요
            );
        } catch (err) {
            console.error('❌ 로그아웃 요청 실패:', err);
            // 서버 요청 실패와 무관하게 클라이언트 측의 토큰/정보는 삭제
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
                <FontAwesomeIcon icon={faArrowRightFromBracket} size="lg" />
            </span>

            {/* 프로필 영역 */}
            <div className="profile-content">
                <div className="profile-info">
                    <span className="profile-name">{userInfo.username}</span>
                    <div className="profile-stats">
                        <span className="stat-item">달성률 {userInfo.completionRate}</span>
                        <span className="stat-item">팔로워 {userInfo.followers}명</span>
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
