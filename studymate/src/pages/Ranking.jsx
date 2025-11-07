import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../api/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUser } from '@fortawesome/free-solid-svg-icons';
import './FollowList.css';

export default function Ranking() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [rankingList, setRankingList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadRanking = async () => {
            try {
                const followingsRes = await fetchWithAuth(`http://127.0.0.1:3000/api/users/${id}/followings`);
                const followings = followingsRes?.followingList || [];

                // 본인 정보 가져오기
                const meRes = await fetchWithAuth(`http://127.0.0.1:3000/api/me`);
                const myId = meRes?.user?.user_id;
                const myName = meRes?.user?.username;

                const allUsers = [
                    ...followings.map((user) => ({
                        userId: user.followee_id,
                        username: user.followername,
                    })),
                    { userId: myId, username: myName }, // 본인 추가
                ];

                const results = await Promise.all(
                    allUsers.map(async (user) => {
                        const challengeRes = await fetchWithAuth(
                            `http://127.0.0.1:3000/api/challenges/${user.userId}/progress/30days`
                        );
                        const achieved = challengeRes?.day30?.day30Achieved || 0;
                        return {
                            username: user.username,
                            userId: user.userId,
                            achieved,
                        };
                    })
                );

                results.sort((a, b) => b.achieved - a.achieved);
                setRankingList(results);
            } catch (err) {
                console.error('❌ 랭킹 정보 요청 실패:', err);
            } finally {
                setLoading(false);
            }
        };

        loadRanking();
    }, [id]);

    const handleBack = () => {
        navigate(-1);
    };

    const handleUserClick = (userId) => {
        navigate(`/profile/${userId}`);
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
                    rankingList.map((user, index) => (
                        <div key={user.userId} className="follow-item" onClick={() => handleUserClick(user.userId)}>
                            <div className="follow-item-icon">
                                <FontAwesomeIcon icon={faUser} />
                            </div>
                            <div className="follow-item-info">
                                <span className="follow-item-name">
                                    {index + 1}위 · {user.username}
                                </span>
                                <span className="follow-item-sub"> 최근 30일 달성: {user.achieved}회</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
