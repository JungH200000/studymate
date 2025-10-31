import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BottomNav from '../components/BottomNav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket, faUser, faThumbsUp, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { fetchWithAuth } from '../api/auth';
import './Profile.css';

export default function Profile({ setTab }) {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('created');

    const [nickname, setNickname] = useState('닉네임');
    const [email, setEmail] = useState('');
    const [createdChallenges, setCreatedChallenges] = useState([]);
    const [joinedChallenges, setJoinedChallenges] = useState([]);

    useEffect(() => {
        const loadUserInfo = async () => {
            try {
                const data = await fetchWithAuth('http://127.0.0.1:3000/api/me');
                if (data?.user?.username) {
                    setNickname(data.user.username);
                    setEmail(data.user.email);
                }
            } catch (err) {
                console.error('❌ 사용자 정보 요청 실패:', err);
            }
        };

        const loadChallenges = async () => {
            try {
                const created = await fetchWithAuth('http://127.0.0.1:3000/api/me/challenges?type=created');
                const joined = await fetchWithAuth('http://127.0.0.1:3000/api/me/challenges?type=joined');

                if (created?.challengesList) setCreatedChallenges(created.challengesList);
                if (joined?.challengesList) setJoinedChallenges(joined.challengesList);
            } catch (err) {
                console.error('❌ 챌린지 목록 요청 실패:', err);
            }
        };

        loadUserInfo();
        loadChallenges();
    }, []);

    const handleChallengeClick = (id) => {
        navigate(`/challenge/${id}`);
    };

    const handleLogout = async () => {
        const confirmLogout = window.confirm('로그아웃하시겠습니까?');
        if (!confirmLogout) return;

        try {
            await axios.post('http://127.0.0.1:3000/api/auth/logout', {}, { withCredentials: true });
        } catch (err) {
            console.error('❌ 로그아웃 요청 실패:', err);
        }

        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        navigate('/login');
    };

    const currentList = activeTab === 'created' ? createdChallenges : joinedChallenges;

    return (
        <div className="profile-container">
            {/* 로그아웃 */}
            <span className="logout-btn" onClick={handleLogout}>
                <FontAwesomeIcon icon={faArrowRightFromBracket} />
            </span>

            {/* 프로필 카드 */}
            <div className="profile-content">
                <div className="profile-info">
                    <span className="profile-name">{nickname}</span>
                    <span className="profile-id">이메일: {email}</span>
                </div>

                <div className="profile-icon">
                    <FontAwesomeIcon icon={faUser} />
                </div>
            </div>

            {/* 탭 */}
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

            {/* 챌린지 목록 */}
            <div className="challenge-list-container">
                {currentList.length === 0 ? (
                    <p>{activeTab === 'created' ? '생성한 챌린지가 없습니다.' : '참여한 챌린지가 없습니다.'}</p>
                ) : (
                    currentList.map((challenge) => (
                        <div
                            key={challenge.challenge_id}
                            className={`challenge-card ${challenge.joined_by_me ? 'joined' : ''} ${
                                challenge.liked_by_me ? 'liked' : ''
                            }`}
                            onClick={() => handleChallengeClick(challenge.challenge_id)}
                        >
                            <h4>{challenge.title}</h4>
                            <p>{challenge.content}</p>

                            <div className="challenge-icons">
                                <FontAwesomeIcon
                                    icon={faThumbsUp}
                                    className={`like-icon ${challenge.liked_by_me ? 'liked' : ''}`}
                                />
                                <span>{challenge.like_count}</span>

                                <FontAwesomeIcon
                                    icon={faUserPlus}
                                    className={`join-icon ${challenge.joined_by_me ? 'joined' : ''}`}
                                />
                                <span>{challenge.participant_count}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <BottomNav setTab={setTab} />
        </div>
    );
}
