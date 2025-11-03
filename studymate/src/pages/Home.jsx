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
import './Home.css';

const API_BASE = 'http://127.0.0.1:3000/api';

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
    const loadChallenges = useCallback(async (query = '') => {
        setIsLoading(true);
        try {
            const url = `${API_BASE}/challenges${query ? `?q=${query}` : ''}`;
            const res = await fetchWithAuth(url);
            const list = Array.isArray(res?.challengesList) ? res.challengesList : [];

            setChallenges(list);

            if (!query) {
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
            }
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
            const url = `${API_BASE}/users${query ? `?q=${query}` : ''}`;
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

    // 🌟 검색 버튼 클릭 핸들러 (API 호출을 담당합니다)
    const handleSearch = useCallback(() => {
        const query = searchQuery.trim();

        if (searchType === 'challenge') {
            loadChallenges(query);
            setUsers([]); // 사용자 목록 초기화
        } else if (searchType === 'user') {
            loadUsers(query);
            setChallenges([]); // 챌린지 목록 초기화
        }
    }, [searchQuery, searchType, loadChallenges, loadUsers]);

    // 🌟 1. 초기 로딩 (컴포넌트 마운트 시 한 번만 전체 챌린지 로드)
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (storedUser.user_id) setUserId(storedUser.user_id);

        loadChallenges();
    }, [loadChallenges]);

    // 🌟 2. 검색 타입(탭) 변경 시, 검색어와 목록을 초기화하고 전체 목록을 로드
    useEffect(() => {
        // 검색 탭이 바뀌면 이전 검색 결과를 지우고, 검색어를 비웁니다.
        setSearchQuery('');
        setUsers([]);
        setChallenges([]);

        // 해당 탭의 전체 목록을 로드합니다.
        if (searchType === 'challenge') {
            loadChallenges('');
        } else if (searchType === 'user') {
            loadUsers('');
        }
    }, [searchType, loadChallenges, loadUsers]); // searchType 변경에만 반응합니다.

    // ❌ 기존 자동 검색 useEffect 로직은 삭제되었습니다.
    /*
    useEffect(() => {
        // 이 로직이 자동 검색을 실행했기 때문에 삭제합니다.
    }, [searchType, searchQuery, loadChallenges, loadUsers]);
    */

    // 챌린지 삭제/좋아요/참가/신고 로직 (변경 없음)
    const toggleLike = async (challengeId, e) => {
        e.stopPropagation();
        if (!userId) return alert('로그인이 필요합니다.');
        // ... (기존 로직 유지) ...
    };

    const toggleParticipation = async (challengeId, e) => {
        e.stopPropagation();
        if (!userId) return alert('로그인이 필요합니다.');
        // ... (기존 로직 유지) ...
    };

    const handleDelete = async (challengeId, e) => {
        e.stopPropagation();
        if (!window.confirm('정말 이 챌린지를 삭제하시겠습니까?')) return;
        if (!userId) return alert('로그인이 필요합니다.');
        // ... (기존 로직 유지) ...
    };

    const handleReportChallenge = async (challengeId, e) => {
        e.stopPropagation();
        if (!userId) return alert('로그인이 필요합니다.');
        // ... (기존 로직 유지) ...
    };

    const handleRefresh = () => window.location.reload();

    const placeholderText =
        searchType === 'challenge' ? '제목 또는 사용자를 검색해보세요.' : '사용자 이름을 검색해보세요';

    // 🌟 사용자 카드 렌더링 함수
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

    // 🌟 챌린지 카드 렌더링 함수 (기존 로직 유지)
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

            {challenge.content && <div className="card-content">{challenge.content}</div>}

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
                <span className="like-count">{likes[challenge.challenge_id]?.count || 0}</span>

                <FontAwesomeIcon
                    icon={faUserPlus}
                    onClick={(e) => toggleParticipation(challenge.challenge_id, e)}
                    className={`join-icon ${participants[challenge.challenge_id]?.joined ? 'joined' : ''}`}
                />
                <span className="join-count">{participants[challenge.challenge_id]?.count || 0}</span>

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

                    {/* 🌟 검색 입력 필드 및 버튼을 포함하는 새로운 구조 */}
                    <div className="search-group">
                        <input
                            type="text"
                            placeholder={placeholderText}
                            className="search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            // Enter 키를 눌렀을 때 검색 실행
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearch();
                                }
                            }}
                        />
                        {/* 🌟 검색 버튼 추가 */}
                        <button className="search-button" onClick={handleSearch}>
                            <FontAwesomeIcon icon={faSearch} />
                        </button>
                    </div>
                    {/* --------------------------- */}
                </div>

                {/* 🌟 검색 탭 */}
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
                </div>
                {/* --------------------------- */}
            </header>

            <main className="home-content">
                {isLoading && (searchQuery || searchType) ? (
                    <div className="loading-spinner">
                        <FontAwesomeIcon icon={faSpinner} spin />
                    </div>
                ) : (
                    <div className="post-list">
                        {/* 챌린지 검색 결과 렌더링 */}
                        {searchType === 'challenge' && challenges.length > 0 && challenges.map(renderChallengeCard)}

                        {/* 사용자 검색 결과 렌더링 */}
                        {searchType === 'user' && users.length > 0 && users.map(renderUserCard)}

                        {/* 결과 없음 메시지 */}
                        {searchType === 'challenge' && challenges.length === 0 && (
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
