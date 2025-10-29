import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../api/auth";
import BottomNav from "../components/BottomNav";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp as solidThumb,
  faUserPlus,
  faUserCheck
} from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp as regularThumb } from "@fortawesome/free-regular-svg-icons";
import "./ChallengeDetail.css";

const API_BASE = "http://localhost:3000/api";

export default function ChallengeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [likes, setLikes] = useState({ liked: false, count: 0 });
  const [participants, setParticipants] = useState({ joined: false, count: 0 });
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [userId, setUserId] = useState(null);
  const [tab, setTab] = useState("detail");

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
      try {
        const res = await fetchWithAuth(`${API_BASE}/challenges`);
        const found = res.challengesList.find((c) => c.challenge_id === id);
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
      }
    };

    const loadPosts = async () => {
      try {
        const res = await fetchWithAuth(`${API_BASE}/challenges/${id}/posts`);
        if (res.ok) setPosts(res.posts || []);
      } catch (err) {
        console.error("인증글 로딩 실패:", err);
      }
    };

    loadChallenge();
    loadPosts();
  }, [id]);

  const toggleLike = async () => {
    if (!userId) return alert("로그인이 필요합니다.");
    const method = likes.liked ? "DELETE" : "POST";
    try {
      const res = await fetchWithAuth(`${API_BASE}/challenges/${id}/likes`, { method });
      if (res.ok) {
        setLikes((prev) => ({
          liked: !prev.liked,
          count: prev.count + (prev.liked ? -1 : 1),
        }));
      }
    } catch (err) {
      console.error("좋아요 실패:", err);
    }
  };

  const toggleParticipation = async () => {
    if (!userId) return alert("로그인이 필요합니다.");
    const method = participants.joined ? "DELETE" : "POST";
    try {
      const res = await fetchWithAuth(`${API_BASE}/challenges/${id}/participants`, { method });
      if (res.ok) {
        setParticipants((prev) => ({
          joined: !prev.joined,
          count: prev.count + (prev.joined ? -1 : 1),
        }));
      }
    } catch (err) {
      console.error("참가 실패:", err);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return alert("내용을 입력해주세요.");
    try {
      const res = await fetchWithAuth(`${API_BASE}/challenges/${id}/posts`, {
        method: "POST",
        body: JSON.stringify({ userId, content: { text: newPost } }),
      });
      if (res.ok && res.post) {
        setPosts((prev) => [res.post, ...prev]);
        setNewPost("");
      }
    } catch (err) {
      console.error("작성 실패:", err);
    }
  };

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
        <p>빈도: {challenge.frequency_type === "daily" ? "일일" : `주 ${challenge.target_per_week}회`}</p>
        <p>기간: {formatDate(challenge.start_date)}{challenge.end_date ? ` ~ ${formatDate(challenge.end_date)}` : ""}</p>

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
