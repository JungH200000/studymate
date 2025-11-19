import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../api/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faArrowLeft, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { API_BASE } from '../api/config';
import './FollowList.css';

export default function FollowingList() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [followings, setFollowings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadFollowings = async () => {
            try {
                const data = await fetchWithAuth(`${API_BASE}/api/users/${id}/followings`);
                if (data?.followingList) {
                    setFollowings(data.followingList);
                }
            } catch (err) {
                console.error('❌ 팔로잉 목록 요청 실패:', err);
            } finally {
                setLoading(false);
            }
        };

        loadFollowings();
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
                <h2>팔로잉</h2>
                <div style={{ width: '36px' }}></div>
            </div>

            {/* 목록 */}
            <div className="follow-list-content">
                {loading ? (
                    <div className="loading-spinner">
                        <FontAwesomeIcon icon={faSpinner} spin />
                    </div>
                ) : followings.length === 0 ? (
                    <p className="empty-message">팔로잉이 없습니다.</p>
                ) : (
                    followings.map((following) => (
                        <div
                            key={following.followee_id}
                            className="follow-item"
                            onClick={() => handleUserClick(following.followee_id)}
                        >
                            <div className="follow-item-icon">
                                <FontAwesomeIcon icon={faUser} />
                            </div>
                            <div className="follow-item-info">
                                <span className="follow-item-name">{following.followername}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
