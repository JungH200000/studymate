import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BottomNav from '../components/BottomNav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket, faUser, faThumbsUp, faUserPlus, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { fetchWithAuth } from '../api/auth';
import './Profile.css';

export default function Profile({ setTab }) {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('created');

    const [nickname, setNickname] = useState('닉네임');
    const [email, setEmail] = useState('');
    const [userId, setUserId] = useState('');
    const [createdChallenges, setCreatedChallenges] = useState([]);
    const [joinedChallenges, setJoinedChallenges] = useState([]);
    const [progressMap, setProgressMap] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    // 팔로우 통계
    const [followerCount, setFollowerCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);

    useEffect(() => {
        const loadUserInfo = async () => {
            try {
                const data = await fetchWithAuth('http://127.0.0.1:3000/api/me');
                if (data?.user) {
                    setNickname(data.user.username || '닉네임');
                    setEmail(data.user.email || '');
                    setUserId(data.user.user_id || '');

                    // user_id를 받은 후 팔로우 통계 로드
                    if (data.user.user_id) {
                        loadFollowStats(data.user.user_id);
                    }
                }
            } catch (err) {
                console.error('❌ 사용자 정보 요청 실패:', err);
            }
        };

        const loadFollowStats = async (user_id) => {
            try {
                const [followers, followings] = await Promise.all([
                    fetchWithAuth(`http://127.0.0.1:3000/api/users/${user_id}/followers`),
                    fetchWithAuth(`http://127.0.0.1:3000/api/users/${user_id}/followings`),
                ]);

                if (followers?.followerCount !== undefined) {
                    setFollowerCount(followers.followerCount);
                }
                if (followings?.followingCount !== undefined) {
                    setFollowingCount(followings.followingCount);
                }
            } catch (err) {
                console.error('❌ 팔로우 통계 요청 실패:', err);
            }
        };

        const loadChallenges = async () => {
            setIsLoading(true);
            try {
                const created = await fetchWithAuth('http://127.0.0.1:3000/api/me/challenges?type=created');
                const joined = await fetchWithAuth('http://127.0.0.1:3000/api/me/challenges?type=joined');

                if (created?.challengesList) setCreatedChallenges(created.challengesList);
                if (joined?.challengesList) setJoinedChallenges(joined.challengesList);
            } catch (err) {
                console.error('❌ 챌린지 목록 요청 실패:', err);
            } finally {
                setIsLoading(false);
            }
        };

        loadUserInfo();
        loadChallenges();
    }, []);

    useEffect(() => {
        if (joinedChallenges.length === 0) return;

        const loadUserProgress = async () => {
            try {
                const res = await fetchWithAuth(`http://127.0.0.1:3000/api/challenges/${userId}/progress/week`);
                if (res?.achievedChallengesList) {
                    const map = {};
                    res.achievedChallengesList.forEach((item) => {
                        map[item.challenge_id] = item;
                    });
                    setProgressMap(map);
                }
            } catch (err) {
                console.error('❌ 사용자 인증률 요청 실패:', err);
            }
        };

        loadUserProgress();
    }, [joinedChallenges]);

    const handleChallengeClick = (id) => {
        navigate(`/challenge/${id}`);
    };

    const handleLogout = async () => {
        const confirmLogout = window.confirm('로그아웃하시겠습니까?');
        if (!confirmLogout) return;

        try {
            await axios.post('http://127.0.0.1:3000/api/auth/logout', {}, { withCredentials: true });
        } catch (err) {
            console.error('❌ 로그아웃 요청 실패:', err);
        }

        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        navigate('/login');
    };

    const handleFollowerClick = () => {
        if (!userId) return;
        navigate(`/users/${userId}/followers`);
    };

    const handleFollowingClick = () => {
        if (!userId) return;
        navigate(`/users/${userId}/followings`);
    };

    const handleMyStatsClick = () => {
        if (!userId) return;
        navigate(`/users/${userId}/achievement`);
    };

    const currentList = activeTab === 'created' ? createdChallenges : joinedChallenges;

    return (
        <div className="profile-container">
            {/* 로그아웃 */}
            <span className="logout-btn" onClick={handleLogout}>
                <FontAwesomeIcon icon={faArrowRightFromBracket} />
            </span>

            {/* 프로필 카드 */}
            <div className="profile-content">
                <div className="profile-info">
                    <span className="profile-name">{nickname}</span>
                    <span className="profile-id">이메일: {email}</span>

                    {/* 팔로우 통계 */}
                    <div className="profile-stats">
                        <span className="stat-item clickable" onClick={handleFollowerClick}>
                            팔로워 <strong>{followerCount}</strong>
                        </span>
                        <span className="stat-divider">·</span>
                        <span className="stat-item clickable" onClick={handleFollowingClick}>
                            팔로잉 <strong>{followingCount}</strong>
                        </span>
                        <span className="stat-divider">·</span>
                        <span className="stat-item clickable" onClick={handleMyStatsClick}>
                            달성률
                        </span>
                    </div>
                </div>

                <div className="profile-icon">
                    <FontAwesomeIcon icon={faUser} />
                </div>
            </div>

            {/* 탭 */}

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

            {/* 챌린지 목록 */}
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

                            {activeTab === 'joined' && progressMap[challenge.challenge_id] && (
                                <div className="challenge-progress">
                                    남은 인증: {progressMap[challenge.challenge_id].remaining_to_100}회 / 남은 일수:{' '}
                                    {progressMap[challenge.challenge_id].remaining_days}일
                                    <br />
                                    주간 달성률:{' '}
                                    {(parseFloat(progressMap[challenge.challenge_id].rate_fullweek) * 100).toFixed(1)}%
                                    <div className="challenge-progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{
                                                width: `${(
                                                    parseFloat(progressMap[challenge.challenge_id].rate_fullweek) * 100
                                                ).toFixed(1)}%`,
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            )}

                            <div className="challenge-icons">
                                <FontAwesomeIcon
                                    icon={faThumbsUp}
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

            <BottomNav setTab={setTab} />
        </div>
    );
}
