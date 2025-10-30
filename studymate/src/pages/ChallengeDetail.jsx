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

// ISO 날짜를 "YYYY년 MM월 DD일" 형식으로 변환하는 함수
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
    const [userId, setUserId] = useState(null);

    // 폼 데이터 상태 (간소화)
    const [formData, setFormData] = useState({
        title: '',
        goalsText: '',
        summary: '',
        takeaways: '',
        textbookName: '',
        textbookPageStart: '',
        textbookPageEnd: '',
        studyHours: '',
        studyMinutesInput: '',
        nextStepsText: '',
    });

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

    // 좋아요 토글
    const toggleLike = async (e) => {
        e?.stopPropagation();
        if (!userId) return alert('로그인이 필요합니다.');

        const liked = likes.liked;

        try {
            const res = await fetchWithAuth(`${API_BASE}/challenges/${id}/likes`, {
                method: liked ? 'DELETE' : 'POST',
            });

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

    // 참가 토글
    const toggleParticipation = async (e) => {
        e?.stopPropagation();
        if (!userId) return alert('로그인이 필요합니다.');

        const joined = participants.joined;

        try {
            const res = await fetchWithAuth(`${API_BASE}/challenges/${id}/participants`, {
                method: joined ? 'DELETE' : 'POST',
            });

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

    // 시간을 분으로 변환
    const convertToMinutes = (hours, minutes) => {
        const h = parseInt(hours || '0', 10) || 0;
        const m = parseInt(minutes || '0', 10) || 0;
        return h * 60 + m;
    };

    // content 페이로드 생성 (간소화)
    const buildContentPayload = () => {
        const content = {};

        if (formData.title?.trim()) content.title = formData.title.trim();

        const goals = (formData.goalsText || '')
            .split(',')
            .map((g) => g.trim())
            .filter(Boolean);
        if (goals.length) content.goals = goals;

        if (formData.summary?.trim()) content.summary = formData.summary.trim();
        if (formData.takeaways?.trim()) content.takeaways = formData.takeaways.trim();

        const materials = {};
        const tName = formData.textbookName?.trim();
        const pStart = formData.textbookPageStart?.trim();
        const pEnd = formData.textbookPageEnd?.trim();
        if (tName || pStart || pEnd) {
            const textbook = {};
            if (tName) textbook.name = tName;
            if (pStart) textbook.pageStart = Number(pStart);
            if (pEnd) textbook.pageEnd = Number(pEnd);
            materials.textbook = textbook;
        }

        if (Object.keys(materials).length) content.materials = materials;

        const studyHours = formData.studyHours?.trim();
        const studyMins = formData.studyMinutesInput?.trim();
        if (studyHours || studyMins) {
            const durationTextParts = [];
            if (studyHours) durationTextParts.push(`${studyHours}시간`);
            if (studyMins) durationTextParts.push(`${studyMins}분`);
            content.studyDurationText = durationTextParts.join(' ');
            content.studyMinutes = convertToMinutes(studyHours, studyMins);
        }

        const nextSteps = (formData.nextStepsText || '')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
        if (nextSteps.length) content.nextSteps = nextSteps;

        return content;
    };

    // 게시글 제출
    const handlePostSubmit = async (e) => {
        e.preventDefault();

        if (!userId) return alert('로그인이 필요합니다.');

        const content = buildContentPayload();
        if (!Object.keys(content).length) {
            return alert('내용을 하나 이상 입력해주세요.');
        }

        try {
            const payload = {
                userId: userId,
                content: content,
            };

            console.log('전송할 페이로드:', payload);

            const res = await fetchWithAuth(`${API_BASE}/challenges/${id}/posts`, {
                method: 'POST',
                body: JSON.stringify(payload),
            });

            console.log('서버 응답:', res);

            if (!res) {
                console.error('fetchWithAuth가 null을 반환했습니다.');
                throw new Error('서버 응답이 없습니다. 네트워크를 확인해주세요.');
            }

            if (res.ok) {
                if (res.post) {
                    setPosts((prev) => [res.post, ...prev]);
                } else {
                    const postsRes = await fetchWithAuth(`${API_BASE}/challenges/${id}/posts`);
                    if (postsRes?.ok && postsRes.posts) {
                        setPosts(postsRes.posts);
                    }
                }

                // 폼 초기화
                setFormData({
                    title: '',
                    goalsText: '',
                    summary: '',
                    takeaways: '',
                    textbookName: '',
                    textbookPageStart: '',
                    textbookPageEnd: '',
                    studyHours: '',
                    studyMinutesInput: '',
                    nextStepsText: '',
                });
                alert('인증글이 등록되었습니다.');
            } else {
                alert('작성 실패: ' + (res?.message || '알 수 없는 오류'));
            }
        } catch (err) {
            console.error('작성 실패 상세:', err);
            alert('인증글 작성 중 오류가 발생했습니다: ' + err.message);
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
                        <input
                            type="text"
                            placeholder="제목"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="form-input"
                        />

                        <input
                            type="text"
                            placeholder="학습 목표 (쉼표로 구분)"
                            value={formData.goalsText}
                            onChange={(e) => setFormData({ ...formData, goalsText: e.target.value })}
                            className="form-input"
                        />

                        <textarea
                            placeholder="학습 요약"
                            value={formData.summary}
                            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                            className="form-textarea"
                        />

                        <textarea
                            placeholder="오늘 배운 점 / 느낀 점"
                            value={formData.takeaways}
                            onChange={(e) => setFormData({ ...formData, takeaways: e.target.value })}
                            className="form-textarea"
                        />

                        <fieldset className="materials-fieldset">
                            <legend>📚 참고 자료 (선택)</legend>

                            <div className="material-section">
                                <label>문제집/교재</label>
                                <input
                                    type="text"
                                    placeholder="문제집 이름"
                                    value={formData.textbookName}
                                    onChange={(e) => setFormData({ ...formData, textbookName: e.target.value })}
                                    className="form-input"
                                />
                                <div className="page-range">
                                    <input
                                        type="number"
                                        placeholder="시작 페이지"
                                        value={formData.textbookPageStart}
                                        onChange={(e) =>
                                            setFormData({ ...formData, textbookPageStart: e.target.value })
                                        }
                                        className="form-input-small"
                                    />
                                    <span>~</span>
                                    <input
                                        type="number"
                                        placeholder="종료 페이지"
                                        value={formData.textbookPageEnd}
                                        onChange={(e) => setFormData({ ...formData, textbookPageEnd: e.target.value })}
                                        className="form-input-small"
                                    />
                                </div>
                            </div>
                        </fieldset>

                        <div className="time-section">
                            <label>⏱️ 학습 시간</label>
                            <div className="time-inputs">
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="시간"
                                    value={formData.studyHours}
                                    onChange={(e) => setFormData({ ...formData, studyHours: e.target.value })}
                                    className="form-input-time"
                                />
                                <span>시간</span>
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="분"
                                    value={formData.studyMinutesInput}
                                    onChange={(e) => setFormData({ ...formData, studyMinutesInput: e.target.value })}
                                    className="form-input-time"
                                />
                                <span>분</span>
                            </div>
                        </div>

                        <input
                            type="text"
                            placeholder="다음 학습 계획 (쉼표로 구분)"
                            value={formData.nextStepsText}
                            onChange={(e) => setFormData({ ...formData, nextStepsText: e.target.value })}
                            className="form-input"
                        />

                        <button type="submit" className="submit-btn">
                            작성
                        </button>
                    </form>
                )}

                <div className="posts-list">
                    {posts.length === 0 && <p>아직 인증 글이 없습니다.</p>}
                    {posts.map((post) => (
                        <div key={post.post_id} className="post-card">
                            {post.content?.title && <h4 className="post-title">{post.content.title}</h4>}

                            {post.content?.goals && post.content.goals.length > 0 && (
                                <div className="post-section">
                                    <strong>🎯 학습 목표:</strong>
                                    <ul className="post-goals">
                                        {post.content.goals.map((g, i) => (
                                            <li key={i}>{g}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {post.content?.summary && (
                                <div className="post-section">
                                    <strong>📝 학습 요약:</strong>
                                    <p>{post.content.summary}</p>
                                </div>
                            )}

                            {post.content?.takeaways && (
                                <div className="post-section">
                                    <strong>💡 배운 점:</strong>
                                    <p>{post.content.takeaways}</p>
                                </div>
                            )}

                            {post.content?.studyDurationText && (
                                <div className="post-section">
                                    <strong>⏱️ 학습시간:</strong>
                                    <span>
                                        {' '}
                                        {post.content.studyDurationText} ({post.content.studyMinutes}분)
                                    </span>
                                </div>
                            )}

                            {post.content?.materials?.textbook && (
                                <div className="post-section">
                                    <strong>📚 교재:</strong>
                                    <span> {post.content.materials.textbook.name}</span>
                                    {post.content.materials.textbook.pageStart && (
                                        <span>
                                            {' '}
                                            (p.{post.content.materials.textbook.pageStart}
                                            {post.content.materials.textbook.pageEnd &&
                                                ` ~ p.${post.content.materials.textbook.pageEnd}`}
                                            )
                                        </span>
                                    )}
                                </div>
                            )}

                            {post.content?.nextSteps && post.content.nextSteps.length > 0 && (
                                <div className="post-section">
                                    <strong>📌 다음 학습:</strong>
                                    <ul className="post-next-steps">
                                        {post.content.nextSteps.map((s, i) => (
                                            <li key={i}>{s}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="post-meta">
                                <span className="post-user">{post.username}</span>
                                <span className="post-date">{new Date(post.created_at).toLocaleString('ko-KR')}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <BottomNav setTab={setTab} />
        </div>
    );
}
