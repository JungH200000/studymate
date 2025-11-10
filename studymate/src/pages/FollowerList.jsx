import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../api/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { API_BASE } from '../api/config';
import './FollowList.css';

export default function FollowerList() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [followers, setFollowers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadFollowers = async () => {
            try {
                const data = await fetchWithAuth(`${API_BASE}/api/users/${id}/followers`);
                if (data?.followerList) {
                    setFollowers(data.followerList);
                }
            } catch (err) {
                console.error('❌ 팔로워 목록 요청 실패:', err);
            } finally {
                setLoading(false);
            }
        };

        loadFollowers();
    }, [id]);

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
                <h2>팔로워</h2>
                <div style={{ width: '24px' }}></div>
            </div>

            {/* 목록 */}
            <div className="follow-list-content">
                {loading ? (
                    <p className="loading-message">로딩 중...</p>
                ) : followers.length === 0 ? (
                    <p className="empty-message">팔로워가 없습니다.</p>
                ) : (
                    followers.map((follower) => (
                        <div
                            key={follower.user_id}
                            className="follow-item"
                            onClick={() => handleUserClick(follower.user_id)}
                        >
                            <div className="follow-item-icon">
                                <FontAwesomeIcon icon={faUser} />
                            </div>
                            <div className="follow-item-info">
                                <span className="follow-item-name">{follower.username}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
