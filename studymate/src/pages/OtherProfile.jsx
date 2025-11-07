import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../api/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faThumbsUp as solidThumbsUp, faUserPlus, faUserMinus, faSpinner } from '@fortawesome/free-solid-svg-icons';
import BottomNav from '../components/BottomNav';
import './Profile.css'; // Profile.css를 공유하여 사용

export default function OtherProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('created'); // 탭 상태 추가

    const [nickname, setNickname] = useState('닉네임');
    const [createdChallenges, setCreatedChallenges] = useState([]);
    const [joinedChallenges, setJoinedChallenges] = useState([]);

    // 팔로우 상태
    const [isFollowing, setIsFollowing] = useState(false);
    const [followerCount, setFollowerCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0); // 팔로잉 수 상태 추가
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadUser = async () => {
            try {
                setIsLoading(true);
                setIsLoading(true);
                // 1. 사용자 기본 정보 로드
                const userData = await fetchWithAuth(`http://127.0.0.1:3000/api/users/${id}`);
                if (userData?.user?.username) {
                    setNickname(userData.user.username);
                }

                // 2. 챌린지 및 팔로우 통계 병렬 로드
                const [created, joined, followers, followings] = await Promise.all([
                    // followings 추가
                    fetchWithAuth(`http://127.0.0.1:3000/api/users/${id}/challenges?type=created`),
                    fetchWithAuth(`http://127.0.0.1:3000/api/users/${id}/challenges?type=joined`),
                    fetchWithAuth(`http://127.0.0.1:3000/api/users/${id}/followers`),
                    fetchWithAuth(`http://127.0.0.1:3000/api/users/${id}/followings`), // 팔로잉 로드 추가
                ]);

                if (created?.challengesList) setCreatedChallenges(created.challengesList);
                if (joined?.challengesList) setJoinedChallenges(joined.challengesList);

                // 팔로우 상태 및 카운트
                if (followers?.followerList) {
                    const myId = JSON.parse(localStorage.getItem('user'))?.user_id;
                    const isFollowingUser = followers.followerList.some((f) => f.user_id === myId);
                    setIsFollowing(isFollowingUser);
                }

                if (followers?.followerCount !== undefined) {
                    setFollowerCount(followers.followerCount);
                }
                if (followings?.followingCount !== undefined) {
                    // 팔로잉 수 설정
                    setFollowingCount(followings.followingCount);
                }
            } catch (err) {
                console.error('❌ 사용자 정보 요청 실패:', err);
                // navigate('/home'); // 에러 시 홈으로 이동은 그대로 유지
            }finally {
                setIsLoading(false);
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

    const currentList = activeTab === 'created' ? createdChallenges : joinedChallenges;

    return (
        <div className="profile-container">
            <div className="profile-content">
                <div className="profile-info">
                    <span className="profile-name">{nickname}</span>
                    {/* 이메일은 상대방 프로필에서 보통 제거 (비공개 정보) */}
                    <span className="profile-id">@{nickname}</span> {/* 임시로 @닉네임 표시 */}
                    {/* 팔로우 통계 (Profile.jsx와 동일한 스타일 적용) */}
                    <div className="profile-stats">
                        {/* 상대방 프로필에서는 클릭 이벤트 제거 */}
                        <span className="stat-item">
                            팔로워 <strong>{followerCount}</strong>
                        </span>
                        <span className="stat-divider">·</span>
                        <span className="stat-item">
                            팔로잉 <strong>{followingCount}</strong>
                        </span>
                    </div>
                    {/* 팔로우/언팔로우 버튼은 통계 아래에 배치 */}
                    <div className="follow-button-container" style={{ marginTop: '15px' }}>
                        {isFollowing ? (
                            <button className="unfollow-button" onClick={handleUnfollow} disabled={isLoading}>
                                <FontAwesomeIcon icon={faUserMinus} />
                                {isLoading ? '처리중...' : ' 언팔로우'}
                            </button>
                        ) : (
                            <button className="follow-button" onClick={handleFollow} disabled={isLoading}>
                                <FontAwesomeIcon icon={faUserPlus} />
                                {isLoading ? '처리중...' : ' 팔로우'}
                            </button>
                        )}
                    </div>
                </div>

                <div className="profile-icon">
                    <FontAwesomeIcon icon={faUser} />
                </div>
            </div>

            {/* 탭 추가 (Profile.jsx와 동일) */}
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

            {/* 챌린지 목록 (Profile.jsx와 동일) */}
            <div className="challenge-list-container">
                {isLoading ? (
                    <div className="loading-spinner">
                        <FontAwesomeIcon icon={faSpinner} spin />
                    </div>
                ) : currentList.length === 0 ? (
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
                                    icon={solidThumbsUp}
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
            <BottomNav setTab={() => {}} />
        </div>
    );
}
