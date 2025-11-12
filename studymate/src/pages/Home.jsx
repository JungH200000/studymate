import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../api/auth';
import BottomNav from '../components/BottomNav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUser,
    faThumbsUp as solidThumbsUp,
    faUserPlus,
    faTrash,
    faRotateRight,
    faFileAlt,
    faSpinner,
    faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp as regularThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { API_BASE } from '../api/config';
import './Home.css';

export default function Home() {
    const [tab, setTab] = useState('home');
    const [challenges, setChallenges] = useState([]);
    const [users, setUsers] = useState([]);
    const [likes, setLikes] = useState({});
    const [participants, setParticipants] = useState({});

    const [userId, setUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('challenge');
    const navigate = useNavigate();

    const formatDate = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    // 챌린지 검색/로딩 함수
    const loadChallenges = useCallback(async (query = '', sort = 'newest') => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (query) params.append('q', query);
            params.append('page', '1');
            params.append('limit', '20');
            params.append('sort', sort);

            const url = `${API_BASE}/api/challenges?${params.toString()}`;
            const res = await fetchWithAuth(url);
            const list = Array.isArray(res?.challengesList) ? res.challengesList : [];

            setChallenges(list);

            // 좋아요와 참여 상태 초기화
            const initialLikes = {};
            const initialParticipants = {};
            list.forEach((c) => {
                initialLikes[c.challenge_id] = {
                    liked: !!c.liked_by_me,
                    count: c.like_count || 0,
                };
                initialParticipants[c.challenge_id] = {
                    joined: !!c.joined_by_me,
                    count: c.participant_count || 0,
                };
            });
            setLikes(initialLikes);
            setParticipants(initialParticipants);
        } catch (err) {
            console.error('챌린지 가져오기 실패:', err);
            setChallenges([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 사용자 검색/로딩 함수
    const loadUsers = useCallback(async (query = '') => {
        setIsLoading(true);
        try {
            const url = `${API_BASE}/api/users${query ? `?q=${query}` : ''}`;
            const res = await fetchWithAuth(url);
            const list = Array.isArray(res?.searchUsers) ? res.searchUsers : [];

            setUsers(list);
        } catch (err) {
            console.error('사용자 가져오기 실패:', err);
            setUsers([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 검색 버튼 클릭 핸들러
    const handleSearch = useCallback(() => {
        const query = searchQuery.trim();

        if (searchType === 'challenge') {
            // 기본 챌린지 검색
            loadChallenges(query, 'newest'); 
            setUsers([]);
        } else if (searchType === 'user') {
            // 사용자 검색
            loadUsers(query);
            setChallenges([]);
        } else if (searchType === 'recommendation') {
            // 추천 챌린지 불러오기
            loadChallenges(query, 'recommendation');
            setUsers([]);
        }
    }, [searchQuery, searchType, loadChallenges, loadUsers]);

    // 초기 로딩
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (storedUser.user_id) setUserId(storedUser.user_id);

        loadChallenges();
    }, [loadChallenges]);

    // 검색 타입 변경 시
    useEffect(() => {
        setSearchQuery('');
        setUsers([]);
        setChallenges([]);

        if (searchType === 'challenge') {
            loadChallenges('');
        } else if (searchType === 'user') {
            loadUsers('');
        }
        else if (searchType === 'recommendation') {
            loadChallenges('', 'recommendation');
        }
    }, [searchType, loadChallenges, loadUsers]);

    // 좋아요 토글
    const toggleLike = async (challengeId, e) => {
        e.stopPropagation();
        if (!userId) return alert('로그인이 필요합니다.');

        const currentState = likes[challengeId];
        const isLiked = currentState?.liked || false;

        // 낙관적 업데이트 (즉시 UI 반영)
        setLikes((prev) => ({
            ...prev,
            [challengeId]: {
                liked: !isLiked,
                count: isLiked ? Math.max(0, (prev[challengeId]?.count || 1) - 1) : (prev[challengeId]?.count || 0) + 1,
            },
        }));

        try {
            if (isLiked) {
                await fetchWithAuth(`${API_BASE}/api/challenges/${challengeId}/likes`, {
                    method: 'DELETE',
                });
            } else {
                await fetchWithAuth(`${API_BASE}/api/challenges/${challengeId}/likes`, {
                    method: 'POST',
                });
            }
        } catch (err) {
            console.error('좋아요 처리 실패:', err);
            // 실패 시 원래 상태로 롤백
            setLikes((prev) => ({
                ...prev,
                [challengeId]: currentState,
            }));
            alert(`좋아요 처리에 실패했습니다.\n에러: ${err.response?.data?.message || err.message}`);
        }
    };

    // 참여 토글
    const toggleParticipation = async (challengeId, e) => {
        e.stopPropagation();
        if (!userId) return alert('로그인이 필요합니다.');

        const currentState = participants[challengeId];
        const isJoined = currentState?.joined || false;

        // 낙관적 업데이트 (즉시 UI 반영)
        setParticipants((prev) => ({
            ...prev,
            [challengeId]: {
                joined: !isJoined,
                count: isJoined
                    ? Math.max(0, (prev[challengeId]?.count || 1) - 1)
                    : (prev[challengeId]?.count || 0) + 1,
            },
        }));

        try {
            if (isJoined) {
                await fetchWithAuth(`${API_BASE}/api/challenges/${challengeId}/participants`, {
                    method: 'DELETE',
                });
            } else {
                await fetchWithAuth(`${API_BASE}/api/challenges/${challengeId}/participants`, {
                    method: 'POST',
                });
            }
        } catch (err) {
            console.error('참여 처리 실패:', err);
            // 실패 시 원래 상태로 롤백
            setParticipants((prev) => ({
                ...prev,
                [challengeId]: currentState,
            }));
            alert(`참여 처리에 실패했습니다.\n에러: ${err.response?.data?.message || err.message}`);
        }
    };

    // 챌린지 삭제
    const handleDelete = async (challengeId, e) => {
        e.stopPropagation();
        if (!window.confirm('정말 이 챌린지를 삭제하시겠습니까?')) return;
        if (!userId) return alert('로그인이 필요합니다.');

        try {
            await fetchWithAuth(`${API_BASE}/api/challenges/${challengeId}`, {
                method: 'DELETE',
            });
            setChallenges((prev) => prev.filter((c) => c.challenge_id !== challengeId));
            alert('챌린지가 삭제되었습니다.');
        } catch (err) {
            console.error('챌린지 삭제 실패:', err);
            alert(`챌린지 삭제에 실패했습니다.\n에러: ${err.response?.data?.message || err.message}`);
        }
    };

    // 챌린지 신고
    const handleReportChallenge = async (challengeId, e) => {
        e.stopPropagation();
        if (!userId) return alert('로그인이 필요합니다.');

        const reason = prompt('신고 사유를 입력해주세요:');
        if (!reason || !reason.trim()) return;

        try {
            await fetchWithAuth(`${API_BASE}/api/reports/challenges/${challengeId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: reason.trim() }),
            });
            alert('신고가 접수되었습니다.');
        } catch (err) {
            console.error('신고 실패:', err);
            alert(`신고 처리에 실패했습니다.\n에러: ${err.response?.data?.message || err.message}`);
        }
    };

    const handleRefresh = () => window.location.reload();

    const placeholderText =
        searchType === 'challenge' ? '제목 또는 사용자를 검색해보세요.' : '사용자 이름을 검색해보세요';

    // 사용자 카드 렌더링 함수
    const renderUserCard = (user) => (
        <div className="user-card" key={user.user_id} onClick={() => navigate(`/profile/${user.user_id}`)}>
            <div className="card-top">
                <FontAwesomeIcon icon={faUser} className="profile-icon" />
                <div className="user-info">
                    <div className="card-username">{user.username || '익명'}</div>
                    <div className="card-title user-card-info">가입일: {formatDate(user.created_at)}</div>
                </div>
            </div>
        </div>
    );

    // 챌린지 카드 렌더링 함수
    const renderChallengeCard = (challenge) => (
        <div
            className="challenge-card"
            key={challenge.challenge_id}
            onClick={() => navigate(`/challenge/${challenge.challenge_id}`)}
        >
            <div className="card-top">
                <FontAwesomeIcon
                    icon={faUser}
                    className="profile-icon"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (challenge.creator_id === userId) {
                            navigate('/profile');
                        } else {
                            navigate(`/profile/${challenge.creator_id}`);
                        }
                    }}
                />
                <div className="user-info">
                    <div className="card-username">{challenge.author_username || '익명'}</div>
                    <div className="card-title">{challenge.title}</div>
                </div>

                {challenge.creator_id === userId ? (
                    <FontAwesomeIcon
                        icon={faTrash}
                        className="delete-icon"
                        onClick={(e) => handleDelete(challenge.challenge_id, e)}
                    />
                ) : (
                    <button className="report-button" onClick={(e) => handleReportChallenge(challenge.challenge_id, e)}>
                        🚨
                    </button>
                )}
            </div>
                        <div className="challenge-content">
                            {challenge.content?.description && (
                                <p className="challenge-description">{challenge.content.description}</p>
                            )}

                            {Array.isArray(challenge.content?.tags) && challenge.content.tags.length > 0 && (
                                <div className="challenge-tags">
                                {challenge.content.tags.map((tag, idx) => (
                                    <span key={idx} className="tag">
                                    #{tag}
                                    </span>
                                ))}
                                </div>
                            )}
                        </div>

            <div className="card-info">
                <span className={challenge.frequency_type === 'daily' ? 'frequency-daily' : 'frequency-weekly'}>
                    {challenge.frequency_type === 'daily' ? '일일' : `주 ${challenge.target_per_week}회`}
                </span>
                <span>
                    {formatDate(challenge.start_date)}
                    {challenge.end_date ? ` ~ ${formatDate(challenge.end_date)}` : ''}
                </span>
            </div>

            <div className="like-section">
                <FontAwesomeIcon
                    icon={likes[challenge.challenge_id]?.liked ? solidThumbsUp : regularThumbsUp}
                    onClick={(e) => toggleLike(challenge.challenge_id, e)}
                    className={`like-icon ${likes[challenge.challenge_id]?.liked ? 'liked' : ''}`}
                />
                <span
                    className="like-count"
                    onClick={(e) => {
                        e.stopPropagation(); // 이벤트 전파 방지
                        navigate(`/likes/${challenge.challenge_id}`);
                    }}
                >
                    {likes[challenge.challenge_id]?.count || 0}
                </span>

                <FontAwesomeIcon
                    icon={faUserPlus}
                    onClick={(e) => toggleParticipation(challenge.challenge_id, e)}
                    className={`join-icon ${participants[challenge.challenge_id]?.joined ? 'joined' : ''}`}
                />
                <span
                    className="join-count"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/participants/${challenge.challenge_id}`);
                    }}
                >
                    {participants[challenge.challenge_id]?.count || 0}
                </span>
                <FontAwesomeIcon icon={faFileAlt} className="stat-icon" />
                <span className="stat-count">{challenge.post_count || 0}</span>
            </div>
        </div>
    );

    return (
        <div className="home-container">
            <header className="home-header">
                <div className="header-content-wrapper">
                    <span className="refresh-emoji" onClick={handleRefresh}>
                        <FontAwesomeIcon icon={faRotateRight} className="refresh-icon" />
                    </span>

                    <div className="search-group">
                        <input
                            type="text"
                            placeholder={placeholderText}
                            className="search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearch();
                                }
                            }}
                        />
                        <button className="search-button" onClick={handleSearch}>
                            <FontAwesomeIcon icon={faSearch} />
                        </button>
                    </div>
                </div>

                <div className="search-tabs-container">
                    <button
                        className={`search-tab ${searchType === 'challenge' ? 'active' : ''}`}
                        onClick={() => setSearchType('challenge')}
                    >
                        챌린지 검색
                    </button>
                    <button
                        className={`search-tab ${searchType === 'user' ? 'active' : ''}`}
                        onClick={() => setSearchType('user')}
                    >
                        사용자 검색
                    </button>
                    <button
                        className={`search-tab ${searchType === 'recommendation' ? 'active' : ''}`}
                        onClick={() => setSearchType('recommendation')}
                    >
                        추천 챌린지
                    </button>
                </div>
            </header>

            <main className="home-content">
                {isLoading && (searchQuery || searchType) ? (
                    <div className="loading-spinner">
                        <FontAwesomeIcon icon={faSpinner} spin />
                    </div>
                ) : (
                    <div className="post-list">
                        {(searchType === 'challenge' || searchType === 'recommendation') &&
                            challenges.length > 0 &&
                            challenges.map(renderChallengeCard)}

                        {searchType === 'user' && users.length > 0 && users.map(renderUserCard)}

                        {(searchType === 'challenge' || searchType === 'recommendation') &&
                            challenges.length === 0 && (
                            <p className="tab-message">
                                {searchQuery
                                ? `'${searchQuery}'에 해당하는 챌린지가 없습니다.`
                                : '등록된 챌린지가 없습니다.'}
                            </p>
                            )}

                        {searchType === 'user' && users.length === 0 && (
                            <p className="tab-message">
                            {searchQuery
                                ? `'${searchQuery}'에 해당하는 사용자가 없습니다.`
                                : '등록된 사용자가 없습니다.'}
                            </p>
                        )}
                        </div>
                )}
            </main>

            <BottomNav setTab={setTab} />
        </div>
    );
}
