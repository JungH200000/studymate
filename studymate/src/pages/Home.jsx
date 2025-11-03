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
    faSpinner,
    faSearch, // 🔍 검색 아이콘 추가
} from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp as regularThumbsUp } from '@fortawesome/free-regular-svg-icons';
import './Home.css';

const API_BASE = 'http://127.0.0.1:3000/api';

export default function Home() {
    const [tab, setTab] = useState('home');
    const [challenges, setChallenges] = useState([]);
    // 🌟 useState 초기값 수정된 상태 유지
    const [likes, setLikes] = useState({});
    const [participants, setParticipants] = useState({});

    const [userId, setUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    // 🌟 검색 상태 추가
    const [searchQuery, setSearchQuery] = useState('');
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

        const loadChallenges = async () => {
            setIsLoading(true);
            try {
                // API에서 전체 챌린지 목록을 불러옵니다.
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
            } finally {
                setIsLoading(false);
            }
        };

        loadChallenges();
    }, []);

    const handleRefresh = () => window.location.reload();

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
                        [challengeId]: {
                            liked: newLiked,
                            count: newCount,
                        },
                    };
                });
            } else {
                alert('좋아요 처리 실패: ' + (res?.message || '알 수 없는 오류'));
            }
        } catch (err) {
            console.error('좋아요 처리 실패:', err);
            alert('좋아요 중 오류가 발생했습니다.');
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
                        [challengeId]: {
                            joined: newJoined,
                            count: newCount,
                        },
                    };
                });
            } else {
                alert('참가 처리 실패: ' + (res?.message || '알 수 없는 오류'));
            }
        } catch (err) {
            console.error('참가 처리 실패:', err);
            alert('참가 중 오류가 발생했습니다.');
        }
    };

    const handleDelete = async (challengeId, e) => {
        e.stopPropagation();
        if (!window.confirm('정말 이 챌린지를 삭제하시겠습니까?')) return;
        if (!userId) return alert('로그인이 필요합니다.');

        try {
            const res = await fetchWithAuth(`${API_BASE}/challenges/${challengeId}`, {
                method: 'DELETE',
            });

            if (res?.ok) {
                setChallenges((prev) => prev.filter((c) => c.challenge_id !== challengeId));
                setLikes((prev) => {
                    const newState = { ...prev };
                    delete newState[challengeId];
                    return newState;
                });
                setParticipants((prev) => {
                    const newState = { ...prev };
                    delete newState[challengeId];
                    return newState;
                });
            } else {
                alert('삭제 실패: ' + (res?.message || '알 수 없는 오류'));
            }
        } catch (err) {
            console.error('삭제 처리 실패:', err);
            alert('삭제 중 오류가 발생했습니다.');
        }
    };

    const handleReportChallenge = async (challengeId, e) => {
        e.stopPropagation();
        if (!userId) return alert('로그인이 필요합니다.');

        const reason = prompt('신고 사유를 입력해주세요 (5~500자)');
        if (!reason || reason.trim().length < 5 || reason.trim().length > 500) {
            return alert('신고 사유는 5~500자여야 합니다.');
        }

        try {
            const res = await fetchWithAuth(`${API_BASE}/reports/challenges/${challengeId}`, {
                method: 'POST',
                body: JSON.stringify({ content: reason.trim() }),
            });

            if (res?.ok) {
                alert('신고되었습니다.');
            } else {
                switch (res?.code) {
                    case 'ERR_ALREADY_REPORTED':
                        alert('이미 신고한 챌린지입니다.');
                        break;
                    case 'INVALID_REPORT_INPUT':
                        alert('신고 사유는 5~500자여야 합니다.');
                        break;
                    default:
                        alert(res?.message || '신고 처리 중 오류가 발생했습니다.');
                }
            }
        } catch (err) {
            console.error('신고 실패:', err);
            alert('신고 요청 중 오류가 발생했습니다.');
        }
    };

    // 🌟 클라이언트 측 챌린지 필터링 로직 수정 (제목 또는 사용자 이름 검색)
    const filteredChallenges = challenges.filter((challenge) => {
        const query = searchQuery.trim().toLowerCase();
        if (query === '') {
            return true; // 검색어가 없으면 모두 표시
        }

        // 제목(title) 또는 사용자 이름(author_username)에 검색어가 포함되어 있는지 확인
        const titleMatch = challenge.title?.toLowerCase().includes(query);
        const usernameMatch = challenge.author_username?.toLowerCase().includes(query); // 🌟 사용자 이름 검색 추가

        return titleMatch || usernameMatch; // 🌟 조건 변경
    });

    return (
        <div className="home-container">
            <header className="home-header">
                <div className="header-content-wrapper">
                    <span className="refresh-emoji" onClick={handleRefresh}>
                        <FontAwesomeIcon icon={faRotateRight} className="refresh-icon" />
                    </span>

                    {/* 🌟 검색 입력 필드 */}
                    <div className="search-box">
                        <FontAwesomeIcon icon={faSearch} className="search-icon-inside" />
                        <input
                            type="text"
                            // 🌟 플레이스홀더 텍스트 수정
                            placeholder="제목 또는 사용자 검색"
                            className="search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    {/* --------------------------- */}

                    <div className="write-button">
                        <p className="challenge-question" onClick={() => navigate('/write')}>
                            누르면 게시판
                        </p>
                    </div>
                </div>
            </header>

            <main className="home-content">
                {isLoading ? (
                    <div className="loading-spinner">
                        <FontAwesomeIcon icon={faSpinner} spin />
                    </div>
                ) : (
                    <div className="post-list">
                        {/* 🌟 필터링된 목록이 없을 때 메시지 */}
                        {filteredChallenges.length === 0 && (
                            <p className="tab-message">
                                {searchQuery
                                    ? `'${searchQuery}'에 해당하는 챌린지가 없습니다.`
                                    : '등록된 챌린지가 없습니다.'}
                            </p>
                        )}

                        {/* 🌟 filteredChallenges를 map하여 렌더링 */}
                        {filteredChallenges.map((challenge) => (
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
                                        <button
                                            className="report-button"
                                            onClick={(e) => handleReportChallenge(challenge.challenge_id, e)}
                                        >
                                            🚨
                                        </button>
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
                                    <span className="like-count">{likes[challenge.challenge_id]?.count || 0}</span>

                                    <FontAwesomeIcon
                                        icon={faUserPlus}
                                        onClick={(e) => toggleParticipation(challenge.challenge_id, e)}
                                        className={`join-icon ${
                                            participants[challenge.challenge_id]?.joined ? 'joined' : ''
                                        }`}
                                    />
                                    <span className="join-count">
                                        {participants[challenge.challenge_id]?.count || 0}
                                    </span>

                                    <FontAwesomeIcon icon={faFileAlt} className="stat-icon" />
                                    <span className="stat-count">{challenge.post_count || 0}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <BottomNav setTab={setTab} />
        </div>
    );
}
