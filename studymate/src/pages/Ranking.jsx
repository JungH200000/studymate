import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../api/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUser } from '@fortawesome/free-solid-svg-icons';
import { API_BASE } from '../api/config';
import './FollowList.css';

export default function Ranking() {
    const navigate = useNavigate();
    const [rankingList, setRankingList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadRanking = async () => {
            try {
                const res = await fetchWithAuth(`${API_BASE}/api/challenges/rankings?page=1&limit=50`);
                const entries = res?.entries || [];

                setRankingList(entries);
            } catch (err) {
                console.error('❌ 랭킹 정보 요청 실패:', err);
            } finally {
                setLoading(false);
            }
        };

        loadRanking();
    }, []);

    const handleBack = () => {
        navigate(-1);
    };

    const handleUserClick = (userId) => {
        const myId = JSON.parse(localStorage.getItem('user'))?.user_id;
        if (userId === myId) {
            navigate('/profile');
        } else {
            navigate(`/profile/${userId}`);
        }
    };

    const formatRankingWithDelta = (ranking, delta) => {
        if (delta > 0) return `${ranking}위 (⬆${delta})`;
        if (delta < 0) return `${ranking}위 (⬇${Math.abs(delta)})`;
        return `${ranking}위`;
    };


    return (
        <div className="follow-list-container">
            <div className="follow-list-header">
                <FontAwesomeIcon icon={faArrowLeft} className="back-button" onClick={handleBack} />
                <h2>나의 랭킹</h2>
                <div style={{ width: '24px' }}></div>
            </div>

            <div className="follow-list-content">
                {loading ? (
                    <p className="loading-message">로딩 중...</p>
                ) : rankingList.length === 0 ? (
                    <p className="empty-message">랭킹 정보가 없습니다.</p>
                ) : (
                    rankingList.map((user) => (
                        <div
                            key={user.user_id}
                            className="follow-item"
                            onClick={() => handleUserClick(user.user_id)}
                        >
                            <div className="follow-item-icon">
                                <FontAwesomeIcon icon={faUser} />
                            </div>
                            <div className="follow-item-info">
                                <span className="follow-item-name">
                                    {formatRankingWithDelta(user.ranking, user.delta)} · {user.username} 
                                </span>
                                <span className="follow-item-sub">
                                    최근 30일 달성: {user.achieved_30d}회 / 목표: {user.expected_30d}회
                                </span>
                                <span className="follow-item-sub">
                                    달성률: {(parseFloat(user.rate) * 100).toFixed(1)}%
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
