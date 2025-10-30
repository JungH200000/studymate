import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../api/auth";
import BottomNav from "../components/BottomNav";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp as solidThumb,
  faUserPlus,
  faUserCheck,
  faSpinner
} from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp as regularThumb } from "@fortawesome/free-regular-svg-icons";
import "./ChallengeDetail.css";

const API_BASE = "http://127.0.0.1:3000/api";

export default function ChallengeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [challenge, setChallenge] = useState(null);
  const [likes, setLikes] = useState({ liked: false, count: 0 });
  const [participants, setParticipants] = useState({ joined: false, count: 0 });
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [tab, setTab] = useState("detail");

  const [formData, setFormData] = useState({
    title: "",
    goalsText: "", // comma separated
    summary: "",
    takeaways: "",
    // materials
    textbookName: "",
    textbookPageStart: "",
    textbookPageEnd: "",
    lectureTeacher: "",
    lectureSeries: "",
    lectureStart: "",
    lectureEnd: "",
    linkInput: "",
    links: [],
    // duration
    studyHours: "",
    studyMinutesInput: "",
    // other
    nextStepsText: "",
    tagsText: "",
  });

  const formatDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (storedUser.user_id) setUserId(storedUser.user_id);

    const loadChallenge = async () => {
      setIsLoading(true);
      try {
        const res = await fetchWithAuth(`${API_BASE}/challenges`);
        const found = res.challengesList?.find((c) => c.challenge_id === id);
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
        }
      } catch (err) {
        console.error("챌린지 로딩 실패:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadChallenge();
  }, [id]);

  const convertToMinutes = (hours, minutes) => {
    const h = parseInt(hours || "0", 10) || 0;
    const m = parseInt(minutes || "0", 10) || 0;
    return h * 60 + m;
  };

  const buildContentPayload = () => {
    const content = {};

    if (formData.title?.trim()) content.title = formData.title.trim();

    const goals = (formData.goalsText || "")
      .split(",")
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

    const lecTeacher = formData.lectureTeacher?.trim();
    const lecSeries = formData.lectureSeries?.trim();
    const lecStart = formData.lectureStart?.trim();
    const lecEnd = formData.lectureEnd?.trim();
    if (lecTeacher || lecSeries || lecStart || lecEnd) {
      const lecture = {};
      if (lecTeacher) lecture.teacher = lecTeacher;
      if (lecSeries) lecture.series = lecSeries;
      if (lecStart) lecture.lessonStart = Number(lecStart);
      if (lecEnd) lecture.lessonEnd = Number(lecEnd);
      materials.lecture = lecture;
    }

    if (formData.links && formData.links.length) {
      materials.links = formData.links.filter(Boolean);
    }

    if (Object.keys(materials).length) content.materials = materials;

    const studyHours = formData.studyHours?.trim();
    const studyMins = formData.studyMinutesInput?.trim();
    if (studyHours || studyMins) {
      const durationTextParts = [];
      if (studyHours) durationTextParts.push(`${studyHours}시간`);
      if (studyMins) durationTextParts.push(`${studyMins}분`);
      content.studyDurationText = durationTextParts.join(" ");
      content.studyMinutes = convertToMinutes(studyHours, studyMins);
    }

    const nextSteps = (formData.nextStepsText || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (nextSteps.length) content.nextSteps = nextSteps;

    const tags = (formData.tagsText || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (tags.length) content.tags = tags;

    return content;
  };

  const toggleLike = async () => {
    if (!userId) return alert("로그인이 필요합니다.");
    const method = likes.liked ? "DELETE" : "POST";

    try {
      const res = await fetchWithAuth(`${API_BASE}/challenges/${id}/likes`, { method });

      if (res?.ok) {
        const { liked_by_me, like_count, created, deleted } = res;
        setLikes({
          liked: liked_by_me,
          count: parseInt(like_count, 10),
        });

        if (created === false || deleted === false) {
          alert("이미 처리된 요청입니다.");
        }
      } else {
        alert("좋아요 실패: " + (res?.message || "알 수 없는 오류"));
      }
    } catch (err) {
      console.error("좋아요 실패:", err);
      alert("좋아요 중 오류가 발생했습니다.");
    }
  };

  const toggleParticipation = async () => {
    if (!userId) return alert("로그인이 필요합니다.");
    const method = participants.joined ? "DELETE" : "POST";

    try {
      const res = await fetchWithAuth(`${API_BASE}/challenges/${id}/participants`, { method });

      if (res?.ok) {
        const { joined_by_me, participant_count, created, deleted } = res;
        setParticipants({
          joined: joined_by_me,
          count: parseInt(participant_count, 10),
        });

        if (created === false || deleted === false) {
          alert("이미 처리된 요청입니다.");
        }
      } else {
        alert("참가 실패: " + (res?.message || "알 수 없는 오류"));
      }
    } catch (err) {
      console.error("참가 실패:", err);
      alert("참가 중 오류가 발생했습니다.");
    }
  };

  const handleAddLink = () => {
    const v = formData.linkInput?.trim();
    if (!v) return;
    setFormData((prev) => ({ ...prev, links: [...(prev.links || []), v], linkInput: "" }));
  };

  const handleRemoveLink = (index) => {
    setFormData((prev) => ({ ...prev, links: prev.links.filter((_, i) => i !== index) }));
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();

    const content = buildContentPayload();
    if (!Object.keys(content).length) {
      return alert("content를 하나 이상 입력해주세요.");
    }

    try {
      const payload = {
        content,
        user_id: userId,
        challenge_id: id,
      };

      const res = await fetchWithAuth(`${API_BASE}/challenges/${id}/posts`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (res.ok && res.post) {
        setPosts((prev) => [res.post, ...prev]);
        setFormData({
          title: "",
          goalsText: "",
          summary: "",
          takeaways: "",
          textbookName: "",
          textbookPageStart: "",
          textbookPageEnd: "",
          lectureTeacher: "",
          lectureSeries: "",
          lectureStart: "",
          lectureEnd: "",
          linkInput: "",
          links: [],
          studyHours: "",
          studyMinutesInput: "",
          nextStepsText: "",
          tagsText: "",
        });
        alert("인증글이 등록되었습니다.");
      } else {
        alert(res.message || "작성 실패");
      }
    } catch (err) {
      console.error("작성 실패:", err);
      alert("인증글 작성 중 오류가 발생했습니다.");
    }
  };

  if (isLoading)
    return (
      <div className="loading-spinner">
        <FontAwesomeIcon icon={faSpinner} spin />
        <span style={{ marginLeft: 10 }}>챌린지를 불러오는 중...</span>
      </div>
    );

  if (!challenge) return <div>챌린지를 찾을 수 없습니다.</div>;

  return (
    <div className="challenge-detail-container">
      <header className="write-header">
        <span className="cancel-btn" onClick={() => navigate("/home")}>❌</span>
      </header>

      <div className="detail-content">
        <h1>{challenge.title}</h1>
        <p>{challenge.content}</p>
        <p>작성자: {challenge.author_username}</p>
        <p>
          빈도: {challenge.frequency_type === "daily" ? "일일" : `주 ${challenge.target_per_week}회`}
        </p>
        <p>
          기간: {formatDate(challenge.start_date)}
          {challenge.end_date ? ` ~ ${formatDate(challenge.end_date)}` : ""}
        </p>

        <div className="icon-section">
          <div className="icon-wrapper">
            <FontAwesomeIcon
              icon={likes.liked ? solidThumb : regularThumb}
              onClick={toggleLike}
              className={`like-icon ${likes.liked ? "liked" : ""}`}
            />
            <span className="like-count">{likes.count}</span>
          </div>

          <div className="icon-wrapper">
            <FontAwesomeIcon
              icon={participants.joined ? faUserCheck : faUserPlus}
              onClick={toggleParticipation}
              className={`join-icon ${participants.joined ? "joined" : ""}`}
            />
            <span className="join-count">{participants.count}</span>
          </div>
        </div>

        {participants.joined && (
          <form className="post-form-card" onSubmit={handlePostSubmit}>
            <input
              type="text"
              placeholder="제목"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />

            <input
              type="text"
              placeholder="학습 목표 (쉼표로 구분)"
              value={formData.goalsText}
              onChange={(e) => setFormData({ ...formData, goalsText: e.target.value })}
            />

            <textarea
              placeholder="학습 요약"
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            />

            <textarea
              placeholder="오늘 배운 점 / 느낀 점"
              value={formData.takeaways}
              onChange={(e) => setFormData({ ...formData, takeaways: e.target.value })}
            />

            <fieldset style={{ border: "1px solid #eee", padding: 10, borderRadius: 6 }}>
              <legend>참고 자료 (선택)</legend>
              <input
                type="text"
                placeholder="문제집 이름"
                value={formData.textbookName}
                onChange={(e) => setFormData({ ...formData, textbookName: e.target.value })}
              />
              <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                <input
                  type="number"
                  placeholder="시작 페이지"
                  value={formData.textbookPageStart}
                  onChange={(e) => setFormData({ ...formData, textbookPageStart: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="종료 페이지"
                  value={formData.textbookPageEnd}
                  onChange={(e) => setFormData({ ...formData, textbookPageEnd: e.target.value })}
                />
              </div>

              <hr style={{ margin: "8px 0" }} />

              <input
                type="text"
                placeholder="강사 이름"
                value={formData.lectureTeacher}
                onChange={(e) => setFormData({ ...formData, lectureTeacher: e.target.value })}
              />
              <input
                type="text"
                placeholder="강의 시리즈"
                value={formData.lectureSeries}
                onChange={(e) => setFormData({ ...formData, lectureSeries: e.target.value })}
              />
              <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                <input
                  type="number"
                  placeholder="강의 시작 번호"
                  value={formData.lectureStart}
                  onChange={(e) => setFormData({ ...formData, lectureStart: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="강의 종료 번호"
                  value={formData.lectureEnd}
                  onChange={(e) => setFormData({ ...formData, lectureEnd: e.target.value })}
                />
              </div>

              <hr style={{ margin: "8px 0" }} />

              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  type="text"
                  placeholder="링크 입력 후 추가"
                  value={formData.linkInput}
                  onChange={(e) => setFormData({ ...formData, linkInput: e.target.value })}
                />
                <button type="button" onClick={handleAddLink} style={{ padding: "6px 10px" }}>
                  추가
                </button>
              </div>

              <div style={{ marginTop: 8 }}>
                {formData.links?.map((lnk, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 6 }}>
                    <a href={lnk} target="_blank" rel="noreferrer" style={{ color: "#0077cc" }}>
                      {lnk}
                    </a>
                    <button type="button" onClick={() => handleRemoveLink(i)} style={{ padding: "4px 8px" }}>
                      삭제
                    </button>
                  </div>
                ))}
              </div>
            </fieldset>

            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="number"
                min="0"
                placeholder="시간(정수)"
                value={formData.studyHours}
                onChange={(e) => setFormData({ ...formData, studyHours: e.target.value })}
              />
              <input
                type="number"
                min="0"
                placeholder="분(정수)"
                value={formData.studyMinutesInput}
                onChange={(e) => setFormData({ ...formData, studyMinutesInput: e.target.value })}
              />
            </div>

            <input
              type="text"
              placeholder="다음 학습(쉼표로 구분)"
              value={formData.nextStepsText}
              onChange={(e) => setFormData({ ...formData, nextStepsText: e.target.value })}
            />

            <input
              type="text"
              placeholder="태그 (쉼표로 구분)"
              value={formData.tagsText}
              onChange={(e) => setFormData({ ...formData, tagsText: e.target.value })}
            />

            <button type="submit">작성</button>
          </form>
        )}

        <div className="posts-list">
          {posts.length === 0 && <p>아직 인증 글이 없습니다.</p>}
          {posts.map((post) => (
            <div key={post.post_id} className="post-card">
              <h4>{post.content?.title || ""}</h4>
              {post.content?.goals && (
                <ul>
                  {post.content.goals.map((g, i) => (
                    <li key={i}>{g}</li>
                  ))}
                </ul>
              )}
              <p>{post.content?.summary}</p>
              <p>{post.content?.takeaways}</p>
              {post.content?.studyDurationText && (
                <p>학습시간: {post.content.studyDurationText} ({post.content.studyMinutes}분)</p>
              )}
              {post.content?.materials?.textbook && (
                <p>
                  교재: {post.content.materials.textbook.name}{" "}
                  {post.content.materials.textbook.pageStart
                    ? `p${post.content.materials.textbook.pageStart}`
                    : ""}{" "}
                  {post.content.materials.textbook.pageEnd ? `~ p${post.content.materials.textbook.pageEnd}` : ""}
                </p>
              )}
              {post.content?.materials?.lecture && (
                <p>
                  강의: {post.content.materials.lecture.teacher} - {post.content.materials.lecture.series} (
                  {post.content.materials.lecture.lessonStart
                    ? post.content.materials.lecture.lessonStart
                    : ""}{" "}
                  {post.content.materials.lecture.lessonEnd ? `~ ${post.content.materials.lecture.lessonEnd}` : ""})
                </p>
              )}
              {post.content?.materials?.links?.length > 0 && (
                <div>
                  링크:
                  <ul>
                    {post.content.materials.links.map((l, idx) => (
                      <li key={idx}>
                        <a href={l} target="_blank" rel="noreferrer">
                          {l}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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
