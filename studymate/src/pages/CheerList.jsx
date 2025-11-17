import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../api/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { API_BASE } from '../api/config';
import './FollowList.css';

export default function CheerList() {
    const { challengeId, postId } = useParams(); // 라우트에서 challengeId, postId 받음
    const navigate = useNavigate();
    const [cheerUsers, setCheerUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCheerUsers = async () => {
            try {
                // 챌린지 전체 인증글 가져오기
                const data = await fetchWithAuth(`${API_BASE}/api/challenges/${challengeId}/posts`);

                if (data?.postsList) {
                    // 내가 보고 싶은 인증글 찾기
                    const targetPost = data.postsList.find((post) => post.post_id === postId);
                    if (targetPost?.cheer_user) {
                        setCheerUsers(targetPost.cheer_user);
                    }
                }
            } catch (err) {
                console.error('❌ 응원 유저 목록 요청 실패:', err);
            } finally {
                setLoading(false);
            }
        };

        loadCheerUsers();
    }, [challengeId, postId]);

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
            <div className="follow-list-header">
                <FontAwesomeIcon icon={faArrowLeft} className="back-button" onClick={handleBack} />
                <h2>응원한 유저</h2>
                <div style={{ width: '24px' }}></div>
            </div>

            <div className="follow-list-content">
                {loading ? (
                    <p className="loading-message">로딩 중...</p>
                ) : cheerUsers.length === 0 ? (
                    <p className="empty-message">응원한 사용자가 없습니다.</p>
                ) : (
                    cheerUsers.map((user) => (
                        <div
                            key={user.cheer_user_id}
                            className="follow-item"
                            onClick={() => handleUserClick(user.cheer_user_id)}
                        >
                            <div className="follow-item-icon">
                                <FontAwesomeIcon icon={faUser} />
                            </div>
                            <div className="follow-item-info">
                                <span className="follow-item-name">{user.cheer_username}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
