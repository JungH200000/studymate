import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../api/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { API_BASE } from '../api/config';
import './Ranking.css';

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
        <div className="ranking-container">
            <div className="ranking-header">
                <FontAwesomeIcon icon={faArrowLeft} className="back-button" onClick={handleBack} />
                <h2>나의 랭킹</h2>
                <div style={{ width: '24px' }}></div>
            </div>

            <div className="ranking-list-content">
                {loading ? (
                    <div className="loading-spinner">
                        <FontAwesomeIcon icon={faSpinner} spin />
                    </div>
                ) : rankingList.length === 0 ? (
                    <p className="empty-message">랭킹 정보가 없습니다.</p>
                ) : (
                    rankingList.map((user) => {
                        const rate = (parseFloat(user.rate) * 100).toFixed(1);
                        const isTopThree = user.ranking <= 3;

                        return (
                            <div
                                key={user.user_id}
                                className={`ranking-item `}
                                onClick={() => handleUserClick(user.user_id)}
                            >
                                {/* 1. 순위/아바타 영역 */}
                                <div className={`ranking-item-rank ${isTopThree ? 'top' : ''}`}>
                                    {isTopThree ? ['🥇', '🥈', '🥉'][user.ranking - 1] : user.ranking}
                                </div>

                                {/* 2. 사용자 정보 및 달성률 막대 */}
                                <div className="ranking-item-info">
                                    <span className="ranking-item-name">
                                        {user.username}
                                        {/* 순위 변동 표시 */}
                                        <span
                                            className={`delta-text delta-${
                                                user.delta > 0 ? 'up' : user.delta < 0 ? 'down' : 'none'
                                            }`}
                                        >
                                            {formatRankingWithDelta('', user.delta).replace(/위/, '')}
                                        </span>
                                    </span>

                                    {/* 최근 30일 달성 요약 */}
                                    <div className="ranking-item-summary">
                                        {user.achieved_30d}/{user.expected_30d}회 달성
                                    </div>

                                    {/* 달성률 진행률 바 */}
                                    <div className="progress-bar-container">
                                        <div className="progress-bar-fill" style={{ width: `${rate}%` }}></div>
                                    </div>
                                </div>

                                {/* 3. 달성률 % 표시 (가장 오른쪽) */}
                                <span className="ranking-item-rate">{rate}%</span>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
