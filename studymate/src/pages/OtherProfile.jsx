import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../api/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faThumbsUp as solidThumbsUp, faUserPlus, faUserMinus } from '@fortawesome/free-solid-svg-icons';
import BottomNav from '../components/BottomNav';
import './Profile.css';
// import './OtherProfile.css';

export default function OtherProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [nickname, setNickname] = useState('닉네임');
    const [createdChallenges, setCreatedChallenges] = useState([]);
    const [joinedChallenges, setJoinedChallenges] = useState([]);

    // 팔로우 상태
    const [isFollowing, setIsFollowing] = useState(false);
    const [followerCount, setFollowerCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = await fetchWithAuth(`http://127.0.0.1:3000/api/users/${id}`);
                if (userData?.user?.username) {
                    setNickname(userData.user.username);
                }

                const [created, joined, followers] = await Promise.all([
                    fetchWithAuth(`http://127.0.0.1:3000/api/users/${id}/challenges?type=created`),
                    fetchWithAuth(`http://127.0.0.1:3000/api/users/${id}/challenges?type=joined`),
                    fetchWithAuth(`http://127.0.0.1:3000/api/users/${id}/followers`),
                ]);

                if (created?.challengesList) setCreatedChallenges(created.challengesList);
                if (joined?.challengesList) setJoinedChallenges(joined.challengesList);

                // 팔로워 목록에서 내가 팔로우했는지 확인
                if (followers?.followerList) {
                    const myId = JSON.parse(localStorage.getItem('user'))?.user_id;
                    const isFollowingUser = followers.followerList.some((f) => f.user_id === myId);
                    setIsFollowing(isFollowingUser);
                }
                // 팔로워 수는 followerCount 사용
                if (followers?.followerCount !== undefined) {
                    setFollowerCount(followers.followerCount);
                }
            } catch (err) {
                console.error('❌ 사용자 정보 요청 실패:', err);
                navigate('/home');
            }
        };

        loadUser();
    }, [id, navigate]);

    const handleFollow = async () => {
        if (isLoading) return;

        setIsLoading(true);
        try {
            const response = await fetchWithAuth(`http://127.0.0.1:3000/api/users/${id}/follows`, {
                method: 'POST',
            });

            if (response?.followResult) {
                setIsFollowing(response.followResult.follow_by_me);
                setFollowerCount(response.followResult.follower_count);
            }
        } catch (err) {
            console.error('❌ 팔로우 실패:', err);
            alert('팔로우에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUnfollow = async () => {
        if (isLoading) return;

        setIsLoading(true);
        try {
            const response = await fetchWithAuth(`http://127.0.0.1:3000/api/users/${id}/follows`, {
                method: 'DELETE',
            });

            if (response?.followResult) {
                setIsFollowing(response.followResult.follow_by_me);
                setFollowerCount(response.followResult.follower_count);
            }
        } catch (err) {
            console.error('❌ 언팔로우 실패:', err);
            alert('언팔로우에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChallengeClick = (challengeId) => {
        navigate(`/challenge/${challengeId}`);
    };

    return (
        <div className="profile-container">
            <div className="profile-content">
                <div className="profile-info">
                    <span className="profile-name">{nickname}</span>
                    <div className="profile-stats">
                        <span className="stat-item">팔로워 {followerCount}명</span>
                    </div>
                </div>

                <div className="profile-icon">
                    <FontAwesomeIcon icon={faUser} />
                </div>
            </div>

            {/* 팔로우/언팔로우 버튼 */}
            <div className="follow-button-container">
                {isFollowing ? (
                    <button className="unfollow-button" onClick={handleUnfollow} disabled={isLoading}>
                        <FontAwesomeIcon icon={faUserMinus} />
                        {isLoading ? '처리중...' : '언팔로우'}
                    </button>
                ) : (
                    <button className="follow-button" onClick={handleFollow} disabled={isLoading}>
                        <FontAwesomeIcon icon={faUserPlus} />
                        {isLoading ? '처리중...' : '팔로우'}
                    </button>
                )}
            </div>

            <div className="challenge-section">
                <h3>{nickname}님이 만든 챌린지</h3>
                {createdChallenges.length === 0 ? (
                    <p className="empty-message">생성한 챌린지가 없습니다.</p>
                ) : (
                    createdChallenges.map((challenge) => (
                        <div
                            key={challenge.challenge_id}
                            className="challenge-card"
                            onClick={() => handleChallengeClick(challenge.challenge_id)}
                        >
                            <h4>{challenge.title}</h4>
                            <p>{challenge.content}</p>
                            <div className="challenge-icons">
                                <FontAwesomeIcon
                                    icon={solidThumbsUp}
                                    className={`like-icon ${challenge.liked_by_me ? 'liked' : ''}`}
                                />
                                <span className="like-count">{challenge.like_count}</span>
                                <FontAwesomeIcon
                                    icon={faUserPlus}
                                    className={`join-icon ${challenge.joined_by_me ? 'joined' : ''}`}
                                />
                                <span className="join-count">{challenge.participant_count}</span>
                            </div>
                        </div>
                    ))
                )}

                <h3>{nickname}님이 참여한 챌린지</h3>
                {joinedChallenges.length === 0 ? (
                    <p className="empty-message">참여한 챌린지가 없습니다.</p>
                ) : (
                    joinedChallenges.map((challenge) => (
                        <div
                            key={challenge.challenge_id}
                            className="challenge-card"
                            onClick={() => handleChallengeClick(challenge.challenge_id)}
                        >
                            <h4>{challenge.title}</h4>
                            <p>{challenge.content}</p>
                            <div className="challenge-icons">
                                <FontAwesomeIcon
                                    icon={solidThumbsUp}
                                    className={`like-icon ${challenge.liked_by_me ? 'liked' : ''}`}
                                />
                                <span className="like-count">{challenge.like_count}</span>
                                <FontAwesomeIcon
                                    icon={faUserPlus}
                                    className={`join-icon ${challenge.joined_by_me ? 'joined' : ''}`}
                                />
                                <span className="join-count">{challenge.participant_count}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <BottomNav setTab={() => {}} />
        </div>
    );
}
