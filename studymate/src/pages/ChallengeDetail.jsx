// src/pages/ChallengeDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../api/auth';
import './ChallengeDetail.css';
import BottomNav from '../components/BottomNav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp as solidThumb } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp as regularThumb } from '@fortawesome/free-regular-svg-icons';
import { faUserPlus, faUserCheck } from '@fortawesome/free-solid-svg-icons';

const API_BASE = 'http://127.0.0.1:3000/api';

// ✅ ISO 날짜를 "YYYY년 MM월 DD일" 형식으로 변환하는 함수
function formatDate(isoString) {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export default function ChallengeDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [challenge, setChallenge] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('detail');
    const [likes, setLikes] = useState({ liked: false, count: 0 });
    const [participants, setParticipants] = useState({ joined: false, count: 0 });
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState('');
    const [userId, setUserId] = useState(null);

    const handleCancel = () => navigate('/home');

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (storedUser.user_id) setUserId(storedUser.user_id);

        const fetchChallenge = async () => {
            try {
                const res = await fetchWithAuth(`${API_BASE}/challenges`);
                if (res.ok && res.challengesList) {
                    const found = res.challengesList.find((c) => String(c.challenge_id) === id);
                    if (found) {
                        setChallenge(found);
                        // Home과 동일하게 초기 좋아요/참가 상태 설정
                        setLikes({
                            liked: !!found.liked_by_me,
                            count: found.like_count || 0,
                        });
                        setParticipants({
                            joined: !!found.joined_by_me,
                            count: found.participant_count || 0,
                        });
                    } else {
                        setChallenge(null);
                    }
                } else {
                    setChallenge(null);
                }
            } catch (error) {
                console.error('Failed to fetch challenges list:', error);
                setChallenge(null);
            } finally {
                setLoading(false);
            }
        };

        const fetchPosts = async () => {
            if (!id) return;
            try {
                const res = await fetchWithAuth(`${API_BASE}/challenges/${id}/posts`);
                if (res.ok) setPosts(res.posts);
            } catch (err) {
                console.error('게시글 조회 실패:', err);
            }
        };

        fetchChallenge();
        fetchPosts();
    }, [id]);

    // 👍 좋아요 토글 (Home과 동일한 로직)
    const toggleLike = async (e) => {
        e?.stopPropagation();
        if (!userId) return alert('로그인이 필요합니다.');

        const liked = likes.liked;

        try {
            const res = await fetchWithAuth(`${API_BASE}/challenges/${id}/likes`, {
                method: liked ? 'DELETE' : 'POST',
            });

            console.log('좋아요 응답:', res);

            if (res?.ok) {
                setLikes({
                    liked: res.liked_by_me ?? !liked,
                    count: Number(res.like_count ?? likes.count + (!liked ? 1 : -1)),
                });
            } else {
                alert('좋아요 처리 실패: ' + (res?.message || '알 수 없는 오류'));
            }
        } catch (err) {
            console.error('좋아요 처리 실패:', err);
            alert('좋아요 중 오류가 발생했습니다.');
        }
    };

    // 🏃 참가 토글 (Home과 동일한 로직)
    const toggleParticipation = async (e) => {
        e?.stopPropagation();
        if (!userId) return alert('로그인이 필요합니다.');

        const joined = participants.joined;

        try {
            const res = await fetchWithAuth(`${API_BASE}/challenges/${id}/participants`, {
                method: joined ? 'DELETE' : 'POST',
            });

            console.log('참가 응답:', res);

            if (res?.ok) {
                setParticipants({
                    joined: res.joined_by_me ?? !joined,
                    count: Number(res.participant_count ?? participants.count + (!joined ? 1 : -1)),
                });
            } else {
                alert('참가 처리 실패: ' + (res?.message || '알 수 없는 오류'));
            }
        } catch (err) {
            console.error('참가 처리 실패:', err);
            alert('참가 중 오류가 발생했습니다.');
        }
    };

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        if (!userId) return alert('로그인이 필요합니다.');
        if (!newPost.trim()) return alert('내용을 입력해주세요.');

        try {
            const res = await fetchWithAuth(`${API_BASE}/challenges/${id}/posts`, {
                method: 'POST',
                body: JSON.stringify({ userId, content: { text: newPost } }),
            });

            if (res.ok) {
                setPosts((prev) => [res.post, ...prev]);
                setNewPost('');
            } else {
                alert('작성 실패: ' + (res.message || '알 수 없는 오류'));
            }
        } catch (err) {
            console.error(err);
            alert('작성 중 오류가 발생했습니다.');
        }
    };

    if (loading) return <div>로딩 중...</div>;
    if (!challenge || String(challenge.challenge_id) !== String(id)) return <div>챌린지를 찾을 수 없습니다.</div>;

    return (
        <div className="challenge-detail-container">
            <header className="write-header">
                <span className="cancel-btn" onClick={handleCancel}>
                    ❌
                </span>
            </header>

            <div className="detail-content">
                <h1>{challenge.title}</h1>
                {challenge.content && <p>{challenge.content}</p>}
                <p>작성자: {challenge.author_username || '익명'}</p>
                <p>빈도: {challenge.frequency_type === 'daily' ? '일일' : `주 ${challenge.target_per_week}회`}</p>
                <p>
                    기간: {formatDate(challenge.start_date)}
                    {challenge.end_date ? ` ~ ${formatDate(challenge.end_date)}` : ''}
                </p>

                <div className="icon-section">
                    <div className="icon-wrapper">
                        <FontAwesomeIcon
                            icon={likes.liked ? solidThumb : regularThumb}
                            onClick={toggleLike}
                            className={`like-icon ${likes.liked ? 'liked' : ''}`}
                        />
                        <span className="like-count">{likes.count}</span>
                    </div>

                    <div className="icon-wrapper">
                        <FontAwesomeIcon
                            icon={participants.joined ? faUserCheck : faUserPlus}
                            onClick={toggleParticipation}
                            className={`join-icon ${participants.joined ? 'joined' : ''}`}
                        />
                        <span className="join-count">{participants.count}</span>
                    </div>
                </div>

                {participants.joined && (
                    <form className="post-form" onSubmit={handlePostSubmit}>
                        <textarea
                            placeholder="챌린지 인증 글을 작성하세요..."
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                        />
                        <button type="submit">작성</button>
                    </form>
                )}

                <div className="posts-list">
                    {posts.length === 0 && <p>아직 인증 글이 없습니다.</p>}
                    {posts.map((post) => (
                        <div key={post.post_id} className="post-card">
                            <p>{post.content.text}</p>
                            <span className="post-user">{post.username}</span>
                            <span className="post-date">{new Date(post.created_at).toLocaleString()}</span>
                        </div>
                    ))}
                </div>
            </div>

            <BottomNav setTab={setTab} />
        </div>
    );
}
