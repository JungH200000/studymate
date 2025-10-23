// src/pages/ChallengeDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ChallengeDetail.css";
import BottomNav from "../components/BottomNav";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp as solidThumb } from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp as regularThumb } from "@fortawesome/free-regular-svg-icons";
import { faUserPlus, faUserCheck, faHandsClapping } from "@fortawesome/free-solid-svg-icons";

export default function ChallengeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("detail");
  const [likes, setLikes] = useState({ liked: false, count: 0 });
  const [participants, setParticipants] = useState({ joined: false, count: 0 });
  const [cheers, setCheers] = useState({ cheered: false, count: 0 });
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [userId, setUserId] = useState(null);

  const handleCancel = () => navigate("/home");

  // 챌린지 + 상태 초기화
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (storedUser.user_id) setUserId(storedUser.user_id);

    const fetchChallenge = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/challenges/${id}`);
        if (!res.ok) return setChallenge(null);
        const data = await res.json();
        if (data.ok) setChallenge(data.challenge);
      } catch {
        setChallenge(null);
      } finally {
        setLoading(false);
      }
    };

    const fetchLikes = async () => {
      if (!id) return;
      try {
        const queryString = userId ? `?userId=${userId}` : "";
        const res = await fetch(`http://localhost:3000/api/challenges/${id}/likes${queryString}`);
        const data = await res.json();
        if (data.ok) setLikes({ liked: data.liked, count: data.count });
      } catch {}
    };

    const fetchParticipants = async () => {
      if (!id) return;
      try {
        const queryString = userId ? `?userId=${userId}` : "";
        const res = await fetch(`http://localhost:3000/api/challenges/${id}/participants${queryString}`);
        const data = await res.json();
        if (data.ok) setParticipants({ joined: data.joined, count: data.count });
      } catch {}
    };

    const fetchCheers = async () => {
      if (!id) return;
      try {
        const queryString = userId ? `?userId=${userId}` : "";
        const res = await fetch(`http://localhost:3000/api/challenges/${id}/cheers${queryString}`);
        const data = await res.json();
        if (data.ok) setCheers({ cheered: data.cheered, count: data.count });
      } catch {}
    };

    const fetchPosts = async () => {
      if (!id) return;
      try {
        const res = await fetch(`http://localhost:3000/api/challenges/${id}/posts`);
        const data = await res.json();
        if (data.ok) setPosts(data.posts);
      } catch {}
    };

    fetchChallenge();
    fetchLikes();
    fetchParticipants();
    fetchCheers();
    fetchPosts();
  }, [id, userId]);

  // 좋아요 토글
  const toggleLike = async () => {
    if (!userId) return alert("로그인이 필요합니다.");
    try {
      const res = await fetch(`http://localhost:3000/api/challenges/${id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (data.ok) setLikes({ liked: data.liked, count: data.count });
    } catch {}
  };

  // 참가 토글
  const toggleParticipation = async () => {
    if (!userId) return alert("로그인이 필요합니다.");
    try {
      const res = await fetch(`http://localhost:3000/api/challenges/${id}/participants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (data.ok) setParticipants({ joined: data.joined, count: data.count });
    } catch {}
  };

  // 응원 토글
  const toggleCheer = async () => {
    if (!userId) return alert("로그인이 필요합니다.");
    try {
      const res = await fetch(`http://localhost:3000/api/challenges/${id}/cheers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (data.ok) setCheers({ cheered: data.cheered, count: data.count });
    } catch {}
  };

  // 인증 글 작성
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return alert("로그인이 필요합니다.");
    if (!newPost.trim()) return alert("내용을 입력해주세요.");

    try {
      const res = await fetch(`http://localhost:3000/api/challenges/${id}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, content: { text: newPost } }),
      });
      const data = await res.json();
      if (data.ok) {
        setPosts((prev) => [data.post, ...prev]);
        setNewPost("");
      } else {
        alert("작성 실패: " + (data.message || "알 수 없는 오류"));
      }
    } catch (err) {
      console.error(err);
      alert("작성 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (!challenge) return <div>챌린지를 찾을 수 없습니다.</div>;

  return (
    <div className="challenge-detail-container">
      <header className="write-header">
        <span className="cancel-btn" onClick={handleCancel}>❌</span>
      </header>

      <div className="detail-content">
        <h1>{challenge.title}</h1>
        {challenge.content && <p>{challenge.content}</p>}
        <p>작성자: {challenge.username}</p>
        <p>빈도: {challenge.frequency_type === "daily" ? "일일" : `주 ${challenge.target_per_week}회`}</p>
        <p>기간: {challenge.start_date}{challenge.end_date ? ` ~ ${challenge.end_date}` : ""}</p>

        <div className="icon-section">
          {/* 좋아요 */}
          <div className="icon-wrapper">
            <FontAwesomeIcon
              icon={likes.liked ? solidThumb : regularThumb}
              onClick={toggleLike}
              className={`like-icon ${likes.liked ? "liked" : ""}`}
            />
            <span className="like-count">{likes.count}</span>
          </div>

          {/* 응원 */}
          <div className="icon-wrapper">
            <FontAwesomeIcon
              icon={faHandsClapping}
              onClick={toggleCheer}
              className={`cheer-icon ${cheers.cheered ? "cheered" : ""}`}
            />
            <span className="cheer-count">{cheers.count}</span>
          </div>

          {/* 참가 */}
          <div className="icon-wrapper">
            <FontAwesomeIcon
              icon={participants.joined ? faUserCheck : faUserPlus}
              onClick={toggleParticipation}
              className={`join-icon ${participants.joined ? "joined" : ""}`}
            />
            <span className="join-count">{participants.count}</span>
          </div>
        </div>

        {/* 인증 글 작성 폼 */}
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

        {/* 인증 글 목록 */}
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
