import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../api/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faArrowLeft, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { API_BASE } from '../api/config';
import './FollowList.css'; // 동일한 스타일 사용

export default function LikeList() {
    const { challengeId } = useParams();
    const navigate = useNavigate();
    const [likeUsers, setLikeUsers] = useState([]);
    const [challengeTitle, setChallengeTitle] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadLikes = async () => {
            try {
                const data = await fetchWithAuth(`${API_BASE}/api/challenges?page=1&limit=100`);
                const list = Array.isArray(data?.challengesList) ? data.challengesList : [];
                const challenge = list.find((c) => c.challenge_id === challengeId);

                if (challenge) {
                    setChallengeTitle(challenge.title);
                    setLikeUsers(challenge.like_user || []);
                }
            } catch (err) {
                console.error('❌ 좋아요 목록 요청 실패:', err);
            } finally {
                setLoading(false);
            }
        };

        loadLikes();
    }, [challengeId]);

    const handleUserClick = (userId) => {
        const myId = JSON.parse(localStorage.getItem('user'))?.user_id;
        if (userId === myId) {
            navigate('/profile');
        } else {
            navigate(`/profile/${userId}`);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="follow-list-container">
            {/* 헤더 */}
            <div className="follow-list-header">
                <FontAwesomeIcon icon={faArrowLeft} className="back-button" onClick={handleBack} />
                <h2>좋아요한 사용자</h2>
                <div style={{ width: '24px' }}></div>
            </div>

            {/* 챌린지 제목 */}
            <div className="challenge-title">
                <h3>{challengeTitle}</h3>
            </div>

            {/* 목록 */}
            <div className="follow-list-content">
                {loading ? (
                    <div className="loading-spinner">
                        <FontAwesomeIcon icon={faSpinner} spin />
                    </div>
                ) : likeUsers.length === 0 ? (
                    <p className="empty-message">좋아요한 사용자가 없습니다.</p>
                ) : (
                    likeUsers.map((user) => (
                        <div
                            key={user.like_user_id}
                            className="follow-item"
                            onClick={() => handleUserClick(user.like_user_id)}
                        >
                            <div className="follow-item-icon">
                                <FontAwesomeIcon icon={faUser} />
                            </div>
                            <div className="follow-item-info">
                                <span className="follow-item-name">{user.like_username}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
