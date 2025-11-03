import React, { useState, useEffect } from 'react';
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
    const [searchType, setSearchType] = useState('challenges'); // 'challenges' | 'users'
    const [query, setQuery] = useState('');
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

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (storedUser.user_id) setUserId(storedUser.user_id);

        loadChallenges();
    }, []);

    const loadChallenges = async () => {
        try {
            const res = await fetchWithAuth(`${API_BASE}/challenges`);
            const list = Array.isArray(res?.challengesList) ? res.challengesList : [];
            setChallenges(list);
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
        }
    };

    const handleRefresh = () => window.location.reload();

    const handleSearch = async () => {
        if (!query.trim()) {
            // 검색어 없으면 전체 목록 다시 불러오기
            setUsers([]);
            loadChallenges();
            return;
        }

        try {
            if (searchType === 'challenges') {
                const res = await fetchWithAuth(`${API_BASE}/challenges?q=${encodeURIComponent(query)}`);
                console.log(`${API_BASE}/challenges?q=${encodeURIComponent(query)}`)
                console.log(res)
                console.log(query)
                setChallenges(res?.challengesList || []);
            } else {
                const res = await fetchWithAuth(`${API_BASE}/users?q=${encodeURIComponent(query)}`);
                console.log(`${API_BASE}/users?q=${encodeURIComponent(query)}`)
                console.log(res)
                console.log(query)
                setUsers(res?.searchUsers || []);
            }
        } catch (err) {
            console.error('검색 실패:', err);
        }
    };

    const toggleLike = async (challengeId, e) => {
        e.stopPropagation();
        if (!userId) return alert('로그인이 필요합니다.');
        const liked = likes[challengeId]?.liked;
        try {
            const res = await fetchWithAuth(`${API_BASE}/challenges/${challengeId}/likes`, {
                method: liked ? 'DELETE' : 'POST',
            });
            if (res?.ok) {
                setLikes((prev) => {
                    const current = prev[challengeId];
                    const newLiked = res.liked_by_me ?? !current.liked;
                    const newCount = Number(res.like_count ?? current.count + (newLiked ? 1 : -1));
                    return {
                        ...prev,
                        [challengeId]: { liked: newLiked, count: newCount },
                    };
                });
            }
        } catch (err) {
            console.error('좋아요 실패:', err);
        }
    };

    const toggleParticipation = async (challengeId, e) => {
        e.stopPropagation();
        if (!userId) return alert('로그인이 필요합니다.');
        const joined = participants[challengeId]?.joined;
        try {
            const res = await fetchWithAuth(`${API_BASE}/challenges/${challengeId}/participants`, {
                method: joined ? 'DELETE' : 'POST',
            });
            if (res?.ok) {
                setParticipants((prev) => {
                    const current = prev[challengeId];
                    const newJoined = res.joined_by_me ?? !current.joined;
                    const newCount = Number(res.participant_count ?? current.count + (newJoined ? 1 : -1));
                    return {
                        ...prev,
                        [challengeId]: { joined: newJoined, count: newCount },
                    };
                });
            }
        } catch (err) {
            console.error('참가 실패:', err);
        }
    };

    const handleDelete = async (challengeId, e) => {
        e.stopPropagation();
        if (!window.confirm('정말 삭제하시겠습니까?')) return;
        try {
            const res = await fetchWithAuth(`${API_BASE}/challenges/${challengeId}`, { method: 'DELETE' });
            if (res?.ok) {
                setChallenges((prev) => prev.filter((c) => c.challenge_id !== challengeId));
            }
        } catch (err) {
            console.error('삭제 실패:', err);
        }
    };

    return (
        <div className="home-container">
            <header className="home-header">
                <span className="refresh-emoji" onClick={handleRefresh}>
                    <FontAwesomeIcon icon={faRotateRight} className="refresh-icon" />
                </span>
                <div className="write-button">
                    <p className="challenge-question" onClick={() => navigate('/write')}>
                        누르면 작성탭으로 이동
                    </p>
                </div>
            </header>

            {/* 검색 영역 */}
            <div className="search-bar">
                <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                    <option value="challenges">챌린지</option>
                    <option value="users">사용자</option>
                </select>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder={
                        searchType === 'challenges'
                            ? '챌린지 제목이나 내용을 검색하세요'
                            : '사용자 이름을 검색하세요'
                    }
                />
                <button onClick={handleSearch}>
                    <FontAwesomeIcon icon={faSearch} />
                </button>
            </div>

            <main className="home-content">
                {searchType === 'challenges' ? (
                    <div className="post-list">
                        {challenges.length === 0 && <p>검색 결과가 없습니다.</p>}
                        {challenges.map((challenge) => (
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
                                            if (challenge.creator_id === userId) navigate('/profile');
                                            else navigate(`/profile/${challenge.creator_id}`);
                                        }}
                                    />
                                    <div className="user-info">
                                        <div className="card-username">{challenge.author_username || '익명'}</div>
                                        <div className="card-title">{challenge.title}</div>
                                    </div>
                                    {challenge.creator_id === userId && (
                                        <FontAwesomeIcon
                                            icon={faTrash}
                                            className="delete-icon"
                                            onClick={(e) => handleDelete(challenge.challenge_id, e)}
                                        />
                                    )}
                                </div>
                                {challenge.content && <div className="card-content">{challenge.content}</div>}
                                <div className="card-info">
                                    <span
                                        className={
                                            challenge.frequency_type === 'daily'
                                                ? 'frequency-daily'
                                                : 'frequency-weekly'
                                        }
                                    >
                                        {challenge.frequency_type === 'daily'
                                            ? '일일'
                                            : `주 ${challenge.target_per_week}회`}
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
                                    <span>{likes[challenge.challenge_id]?.count || 0}</span>
                                    <FontAwesomeIcon
                                        icon={faUserPlus}
                                        onClick={(e) => toggleParticipation(challenge.challenge_id, e)}
                                        className={`join-icon ${
                                            participants[challenge.challenge_id]?.joined ? 'joined' : ''
                                        }`}
                                    />
                                    <span>{participants[challenge.challenge_id]?.count || 0}</span>
                                    <FontAwesomeIcon icon={faFileAlt} className="stat-icon" />
                                    <span>{challenge.post_count || 0}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="user-list">
                        {users.length === 0 && <p>검색 결과가 없습니다.</p>}
                        {users.map((u) => (
                            <div
                                key={u.user_id}
                                className="user-card"
                                onClick={() => navigate(`/profile/${u.user_id}`)}
                            >
                                <FontAwesomeIcon icon={faUser} className="user-icon" />
                                <span>{u.username}</span>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <BottomNav setTab={setTab} />
        </div>
    );
}
