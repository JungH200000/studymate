import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../api/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './FollowList.css'; // 기존 스타일 재사용

export default function ParticipantList() {
    const { challengeId } = useParams();
    const navigate = useNavigate();
    const [participants, setParticipants] = useState([]);
    const [challengeTitle, setChallengeTitle] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadParticipants = async () => {
            try {
                const data = await fetchWithAuth('http://127.0.0.1:3000/api/challenges?page=1&limit=100');
                const list = Array.isArray(data?.challengesList) ? data.challengesList : [];
                const challenge = list.find((c) => c.challenge_id === challengeId);

                if (challenge) {
                    setChallengeTitle(challenge.title);
                    setParticipants(challenge.participant_user || []);
                }
            } catch (err) {
                console.error('❌ 참가자 목록 요청 실패:', err);
            } finally {
                setLoading(false);
            }
        };

        loadParticipants();
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
                <h2>참가자 목록</h2>
                <div style={{ width: '24px' }}></div>
            </div>

            {/* 챌린지 제목 */}
            <div className="challenge-title">
                <h3>{challengeTitle}</h3>
            </div>

            {/* 목록 */}
            <div className="follow-list-content">
                {loading ? (
                    <p className="loading-message">로딩 중...</p>
                ) : participants.length === 0 ? (
                    <p className="empty-message">참가자가 없습니다.</p>
                ) : (
                    participants.map((user) => (
                        <div
                            key={user.participant_user_id}
                            className="follow-item"
                            onClick={() => handleUserClick(user.participant_user_id)}
                        >
                            <div className="follow-item-icon">
                                <FontAwesomeIcon icon={faUser} />
                            </div>
                            <div className="follow-item-info">
                                <span className="follow-item-name">{user.participant_username}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
