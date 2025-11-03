import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../api/auth';
import BottomNav from '../components/BottomNav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faThumbsUp as solidThumb,
    faUserPlus,
    faUserCheck,
    faSpinner,
    faFileAlt,
    faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp as regularThumb } from '@fortawesome/free-regular-svg-icons';
import './ChallengeDetail.css';

const API_BASE = 'http://127.0.0.1:3000/api';

export default function ChallengeDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [challenge, setChallenge] = useState(null);
    const [likes, setLikes] = useState({ liked: false, count: 0 });
    const [participants, setParticipants] = useState({ joined: false, count: 0 });
    const [posts, setPosts] = useState([]);
    const [userId, setUserId] = useState(null);
    const [tab, setTab] = useState('detail');

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
        tagsText: '',
    });

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

        const loadChallenge = async () => {
            setIsLoading(true);
            try {
                const res = await fetchWithAuth(`${API_BASE}/challenges`);
                const found = res.challengesList?.find((c) => String(c.challenge_id) === String(id));
                if (found) {
                    setChallenge(found);
                    setLikes({ liked: !!found.liked_by_me, count: found.like_count || 0 });
                    setParticipants({ joined: !!found.joined_by_me, count: found.participant_count || 0 });
                }
            } catch (err) {
                console.error('챌린지 로딩 실패:', err);
            } finally {
                setIsLoading(false);
            }
        };

        const loadPosts = async () => {
            try {
                const res = await fetchWithAuth(`${API_BASE}/challenges/${id}/posts`);
                if (res.ok && Array.isArray(res.postsList)) {
                    const postsWithCheer = res.postsList.map((p) => ({
                        ...p,
                        cheer_by_me: !!p.cheer_by_me,
                        cheer_count: p.cheer_count || 0,
                    }));
                    setPosts(postsWithCheer);
                }
            } catch (err) {
                console.error('인증글 로딩 실패:', err);
            }
        };

        loadChallenge();
        loadPosts();
    }, [id]);

    const convertToMinutes = (hours, minutes) => {
        const h = parseInt(hours || '0', 10) || 0;
        const m = parseInt(minutes || '0', 10) || 0;
        return h * 60 + m;
    };

    const buildContentPayload = () => {
        const content = {};
        if (formData.title?.trim()) content.title = formData.title.trim();

        const goals = formData.goalsText
            .split(',')
            .map((g) => g.trim())
            .filter(Boolean);
        if (goals.length) content.goals = goals;

        if (formData.summary?.trim()) content.summary = formData.summary.trim();
        if (formData.takeaways?.trim()) content.takeaways = formData.takeaways.trim();

        const materials = {};
        if (formData.textbookName || formData.textbookPageStart || formData.textbookPageEnd) {
            const textbook = {};
            if (formData.textbookName) textbook.name = formData.textbookName.trim();
            if (formData.textbookPageStart) textbook.pageStart = Number(formData.textbookPageStart);
            if (formData.textbookPageEnd) textbook.pageEnd = Number(formData.textbookPageEnd);
            materials.textbook = textbook;
        }
        if (Object.keys(materials).length) content.materials = materials;

        if (formData.studyHours || formData.studyMinutesInput) {
            const durationParts = [];
            if (formData.studyHours) durationParts.push(`${formData.studyHours}시간`);
            if (formData.studyMinutesInput) durationParts.push(`${formData.studyMinutesInput}분`);
            content.studyDurationText = durationParts.join(' ');
            content.studyMinutes = convertToMinutes(formData.studyHours, formData.studyMinutesInput);
        }

        const nextSteps = formData.nextStepsText
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
        if (nextSteps.length) content.nextSteps = nextSteps;

        const tags = formData.tagsText
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean);
        if (tags.length) content.tags = tags;

        return content;
    };

    const toggleLike = async () => {
        if (!userId) return alert('로그인이 필요합니다.');
        const method = likes.liked ? 'DELETE' : 'POST';

        try {
            const res = await fetchWithAuth(`${API_BASE}/challenges/${id}/likes`, { method });
            if (res?.ok) {
                setLikes({ liked: res.liked_by_me, count: parseInt(res.like_count, 10) });
            } else {
                alert('좋아요 실패: ' + (res?.message || '알 수 없는 오류'));
            }
        } catch (err) {
            console.error('좋아요 실패:', err);
            alert('좋아요 중 오류가 발생했습니다.');
        }
    };

    const toggleParticipation = async () => {
        if (!userId) return alert('로그인이 필요합니다.');
        const method = participants.joined ? 'DELETE' : 'POST';

        try {
            const res = await fetchWithAuth(`${API_BASE}/challenges/${id}/participants`, { method });
            if (res?.ok) {
                setParticipants({ joined: res.joined_by_me, count: parseInt(res.participant_count, 10) });
            } else {
                alert('참가 실패: ' + (res?.message || '알 수 없는 오류'));
            }
        } catch (err) {
            console.error('참가 실패:', err);
            alert('참가 중 오류가 발생했습니다.');
        }
    };

    const toggleCheer = async (postId, cheerByMe) => {
        const method = cheerByMe ? 'DELETE' : 'POST';

        try {
            const res = await fetchWithAuth(`${API_BASE}/challenges/posts/${postId}/cheers`, { method });
            if (!res || typeof res.cheer_by_me !== 'boolean') {
                alert(res?.message || '응원 요청에 실패했습니다.');
                return;
            }

            setPosts((prev) =>
                prev.map((p) =>
                    p.post_id === postId ? { ...p, cheer_by_me: res.cheer_by_me, cheer_count: res.cheer_count } : p
                )
            );
        } catch (err) {
            console.error('응원 처리 실패:', err);
            alert('응원 중 오류가 발생했습니다.');
        }
    };

    const handleReportChallenge = async (e) => {
        e.stopPropagation();
        if (!userId) return alert('로그인이 필요합니다.');

        const reason = prompt('챌린지 신고 사유를 입력해주세요 (5~500자)');
        if (!reason || reason.trim().length < 5 || reason.trim().length > 500) {
            return alert('신고 사유는 5~500자여야 합니다.');
        }

        try {
            const res = await fetchWithAuth(`${API_BASE}/reports/challenges/${id}`, {
                method: 'POST',
                body: JSON.stringify({ content: reason.trim() }),
            });

            if (res?.ok) {
                alert('챌린지가 신고되었습니다.');
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
            console.error('챌린지 신고 실패:', err);
            alert('신고 요청 중 오류가 발생했습니다.');
        }
    };

    const handleReportPost = async (postId, e) => {
        e.stopPropagation();
        if (!userId) return alert('로그인이 필요합니다.');

        const reason = prompt('인증글 신고 사유를 입력해주세요 (5~500자)');
        if (!reason || reason.trim().length < 5 || reason.trim().length > 500) {
            return alert('신고 사유는 5~500자여야 합니다.');
        }

        try {
            const res = await fetchWithAuth(`${API_BASE}/reports/posts/${postId}`, {
                method: 'POST',
                body: JSON.stringify({ content: reason.trim() }),
            });

            if (res?.ok) {
                alert('인증글이 신고되었습니다.');
            } else {
                switch (res?.code) {
                    case 'ERR_ALREADY_REPORTED':
                        alert('이미 신고한 인증글입니다.');
                        break;
                    case 'INVALID_REPORT_INPUT':
                        alert('신고 사유는 5~500자여야 합니다.');
                        break;
                    default:
                        alert(res?.message || '신고 처리 중 오류가 발생했습니다.');
                }
            }
        } catch (err) {
            console.error('인증글 신고 실패:', err);
            alert('신고 요청 중 오류가 발생했습니다.');
        }
    };

    const handleDeletePost = async (postId, e) => {
        e.stopPropagation();
        if (!window.confirm('정말 이 인증글을 삭제하시겠습니까?')) return;
        if (!userId) return alert('로그인이 필요합니다.');

        try {
            const res = await fetchWithAuth(`${API_BASE}/challenges/posts/${postId}`, {
                method: 'DELETE',
            });

            if (res?.ok) {
                setPosts((prev) => prev.filter((p) => p.post_id !== postId));
                setChallenge((prev) => ({ ...prev, post_count: (prev.post_count || 1) - 1 }));
                alert('인증글이 삭제되었습니다.');
            } else {
                alert('삭제 실패: ' + (res?.message || '알 수 없는 오류'));
            }
        } catch (err) {
            console.error('인증글 삭제 실패:', err);
            alert('삭제 중 오류가 발생했습니다.');
        }
    };

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        if (!userId) return alert('로그인이 필요합니다.');

        const content = buildContentPayload();
        if (!Object.keys(content).length) return alert('내용을 하나 이상 입력해주세요.');

        try {
            const payload = { user_id: userId, challenge_id: id, content };
            const res = await fetchWithAuth(`${API_BASE}/challenges/${id}/posts`, {
                method: 'POST',
                body: JSON.stringify(payload),
            });

            if (res?.ok && res.post) {
                // 새 인증글을 목록에 추가
                const newPost = {
                    ...res.post,
                    cheer_by_me: false,
                    cheer_count: 0,
                };
                setPosts((prev) => [newPost, ...prev]);

                // 챌린지 인증글 수 업데이트
                setChallenge((prev) => ({ ...prev, post_count: res.post_count }));

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
                    tagsText: '',
                });

                // 주간 목표 달성 정보 표시
                const { myPostCount, myWeekPostCount, getWeeklyTarget } = res;
                const remaining = Math.max(getWeeklyTarget - myWeekPostCount, 0);

                if (remaining === 0) {
                    alert(
                        `🎉 인증글이 등록되었습니다!\n\n` +
                            `📊 내 인증글 수: ${myPostCount}개\n` +
                            `📅 이번 주 인증글: ${myWeekPostCount}/${getWeeklyTarget}개\n\n` +
                            `✨ 이번 주 목표를 모두 달성했어요! 멋져요! 👏`
                    );
                } else {
                    alert(
                        `✅ 인증글이 등록되었습니다!\n\n` +
                            `📊 내 인증글 수: ${myPostCount}개\n` +
                            `📅 이번 주 인증글: ${myWeekPostCount}/${getWeeklyTarget}개\n\n` +
                            `💪 이번 주에 ${remaining}번 더 작성하면 목표 달성!`
                    );
                }
            } else {
                // 에러 코드별 메시지 처리
                switch (res?.code) {
                    case 'CHALLENGE_NOT_FOUND':
                        alert('챌린지를 찾을 수 없습니다.');
                        break;
                    case 'INVALID_POST_INPUT':
                        alert('내용을 하나 이상 입력해주세요.');
                        break;
                    case 'NOT_PARTICIPATION':
                        alert('해당 챌린지에 참여하지 않았습니다. 먼저 참가 신청을 해주세요.');
                        break;
                    case 'ERR_ALREADY_POSTED_TODAY':
                        alert('오늘은 이미 인증글을 작성하셨습니다. 내일 다시 작성해주세요!');
                        break;
                    default:
                        alert(res?.message || '인증글 작성에 실패했습니다.');
                }
            }
        } catch (err) {
            console.error('작성 실패:', err);
            alert('인증글 작성 중 오류가 발생했습니다.');
        }
    };

    if (isLoading)
        return (
            <div className="loading-spinner">
                <FontAwesomeIcon icon={faSpinner} spin />
            </div>
        );

    if (!challenge) return <div>챌린지를 찾을 수 없습니다.</div>;

    return (
        <div className="challenge-detail-container">
            <header className="write-header">
                <span className="cancel-btn" onClick={() => navigate('/home')}>
                    ❌
                </span>
            </header>

            <div className="detail-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1>{challenge.title}</h1>
                    {userId && challenge.creator_id === userId ? (
                        <FontAwesomeIcon
                            icon={faTrash}
                            className="delete-icon"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm('정말 이 챌린지를 삭제하시겠습니까?')) {
                                    // 삭제 로직 구현 필요
                                    alert('챌린지 삭제 기능은 구현 필요');
                                }
                            }}
                        />
                    ) : (
                        <button className="report-button" onClick={handleReportChallenge}>
                            🚨
                        </button>
                    )}
                </div>

                <p>{challenge.content}</p>
                <p>작성자: {challenge.author_username}</p>
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

                    <div className="icon-wrapper">
                        <FontAwesomeIcon icon={faFileAlt} className="stat-icon" />
                        <span className="stat-count">{challenge.post_count}</span>
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
                        <input
                            type="text"
                            placeholder="태그 (쉼표로 구분)"
                            value={formData.tagsText}
                            onChange={(e) => setFormData({ ...formData, tagsText: e.target.value })}
                            className="form-input"
                        />
                        <button type="submit" className="submit-btn">
                            작성
                        </button>
                    </form>
                )}

                <div className="posts-list">
                    {posts.length === 0 && <p className="no-posts-message">아직 인증 글이 없습니다.</p>}
                    {posts.map((post) => (
                        <div key={post.post_id} className="post-card">
                            {/* 헤더: 제목 + 삭제/신고 */}
                            <div className="post-header">
                                <div className="post-title-section">
                                    {post.content?.title && <h3 className="post-title">📝 {post.content.title}</h3>}
                                </div>
                                {userId && post.user_id === userId ? (
                                    <FontAwesomeIcon
                                        icon={faTrash}
                                        className="delete-icon"
                                        onClick={(e) => handleDeletePost(post.post_id, e)}
                                    />
                                ) : (
                                    <button
                                        className="report-button"
                                        onClick={(e) => handleReportPost(post.post_id, e)}
                                    >
                                        🚨
                                    </button>
                                )}
                            </div>

                            {/* 학습 목표 */}
                            {post.content?.goals?.length > 0 && (
                                <div className="post-section goals-section">
                                    <div className="section-header">🎯 학습 목표</div>
                                    <ul className="post-goals">
                                        {post.content.goals.map((g, i) => (
                                            <li key={i}>{g}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* 학습 요약 */}
                            {post.content?.summary && (
                                <div className="post-section summary-section">
                                    <div className="section-header">📝 학습 요약</div>
                                    <p className="section-content">{post.content.summary}</p>
                                </div>
                            )}

                            {/* 배운 점 */}
                            {post.content?.takeaways && (
                                <div className="post-section takeaways-section">
                                    <div className="section-header">💡 배운 점</div>
                                    <p className="section-content">{post.content.takeaways}</p>
                                </div>
                            )}

                            {/* 학습 정보 그리드 */}
                            <div className="post-info-grid">
                                {post.content?.studyDurationText && (
                                    <div className="info-card">
                                        <div className="info-icon">⏱️</div>
                                        <div className="info-text">
                                            <div className="info-label">학습시간</div>
                                            <div className="info-value">{post.content.studyDurationText}</div>
                                        </div>
                                    </div>
                                )}

                                {post.content?.materials?.textbook && (
                                    <div className="info-card">
                                        <div className="info-icon">📚</div>
                                        <div className="info-text">
                                            <div className="info-label">교재</div>
                                            <div className="info-value">
                                                {post.content.materials.textbook.name}
                                                {post.content.materials.textbook.pageStart && (
                                                    <span className="page-info">
                                                        {' '}
                                                        (p.{post.content.materials.textbook.pageStart}
                                                        {post.content.materials.textbook.pageEnd &&
                                                            `-${post.content.materials.textbook.pageEnd}`}
                                                        )
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 다음 학습 */}
                            {post.content?.nextSteps?.length > 0 && (
                                <div className="post-section nextsteps-section">
                                    <div className="section-header">📌 다음 학습 계획</div>
                                    <ul className="post-nextsteps">
                                        {post.content.nextSteps.map((s, i) => (
                                            <li key={i}>{s}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* 태그 */}
                            {post.content?.tags?.length > 0 && (
                                <div className="post-tags">
                                    {post.content.tags.map((tag, i) => (
                                        <span key={i} className="tag">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* 푸터: 작성자 + 날짜 + 응원 */}
                            <div className="post-footer">
                                <div className="post-meta">
                                    <span className="post-user">👤 {post.username}</span>
                                    <span className="post-date">
                                        {new Date(post.created_at).toLocaleDateString('ko-KR', {
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </span>
                                </div>
                                <div className="cheer-wrapper">
                                    <FontAwesomeIcon
                                        icon={post.cheer_by_me ? solidThumb : regularThumb}
                                        onClick={() => toggleCheer(post.post_id, post.cheer_by_me)}
                                        className={`cheer-icon ${post.cheer_by_me ? 'cheered' : ''}`}
                                    />
                                    <span className="cheer-count">{post.cheer_count}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <BottomNav setTab={setTab} />
        </div>
    );
}
