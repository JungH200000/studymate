import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../api/auth";
import BottomNav from "../components/BottomNav";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faThumbsUp as solidThumbsUp,
  faUserPlus,
  faTrash
} from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp as regularThumbsUp } from "@fortawesome/free-regular-svg-icons";
import "./Home.css";

const API_BASE = "http://127.0.0.1:3000/api";

export default function Home() {
  const [tab, setTab] = useState("home");
  const [challenges, setChallenges] = useState([]);
  const [likes, setLikes] = useState({});
  const [participants, setParticipants] = useState({});
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

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
        console.error("챌린지 가져오기 실패:", err);
      }
    };

    loadChallenges();
  }, []);

  const handleRefresh = () => window.location.reload();

  const toggleLike = async (challengeId, e) => {
    e.stopPropagation();
    if (!userId) return alert("로그인이 필요합니다.");

    const liked = likes[challengeId]?.liked;

    try {
      const res = await fetchWithAuth(`${API_BASE}/challenges/${challengeId}/likes`, {
        method: liked ? "DELETE" : "POST",
      });

      if (res?.ok) {
        setLikes((prev) => {
          const current = prev[challengeId];
          const newLiked = !current.liked;
          return {
            ...prev,
            [challengeId]: {
              liked: newLiked,
              count: current.count + (newLiked ? 1 : -1),
            },
          };
        });
      } else {
        alert("좋아요 처리 실패: " + (res?.message || "알 수 없는 오류"));
      }
    } catch (err) {
      console.error("좋아요 처리 실패:", err);
      alert("좋아요 중 오류가 발생했습니다.");
    }
  };

  const toggleParticipation = async (challengeId, e) => {
    e.stopPropagation();
    if (!userId) return alert("로그인이 필요합니다.");

    const joined = participants[challengeId]?.joined;

    try {
      const res = await fetchWithAuth(`${API_BASE}/challenges/${challengeId}/participants`, {
        method: joined ? "DELETE" : "POST",
      });

      if (res?.ok) {
        setParticipants((prev) => {
          const current = prev[challengeId];
          const newJoined = !current.joined;
          return {
            ...prev,
            [challengeId]: {
              joined: newJoined,
              count: current.count + (newJoined ? 1 : -1),
            },
          };
        });
      } else {
        alert("참가 처리 실패: " + (res?.message || "알 수 없는 오류"));
      }
    } catch (err) {
      console.error("참가 처리 실패:", err);
      alert("참가 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async (challengeId, e) => {
    e.stopPropagation();
    if (!window.confirm("정말 이 챌린지를 삭제하시겠습니까?")) return;
    if (!userId) return alert("로그인이 필요합니다.");

    try {
      const res = await fetchWithAuth(`${API_BASE}/challenges/${challengeId}`, {
        method: "DELETE",
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
        alert("삭제 실패: " + (res?.message || "알 수 없는 오류"));
      }
    } catch (err) {
      console.error("삭제 처리 실패:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <span className="refresh-emoji" onClick={handleRefresh}>🔄</span>
        <div className="write-button">
          <p className="challenge-question" onClick={() => navigate("/write")}>
            누르면 작성탭으로 이동
          </p>
        </div>
      </header>

      <main className="home-content">
        <div className="post-list">
          {challenges.length === 0 && (
            <p className="tab-message">등록된 챌린지가 없습니다.</p>
          )}

          {challenges.map((challenge) => (
            <div
              className="challenge-card"
              key={challenge.challenge_id}
              onClick={() => navigate(`/challenge/${challenge.challenge_id}`)}
            >
              <div className="card-top">
                <FontAwesomeIcon icon={faUser} className="profile-icon" />
                <div className="user-info">
                  <div className="card-username">
                    {challenge.author_username || "익명"}
                  </div>
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

              {challenge.content && (
                <div className="card-content">{challenge.content}</div>
              )}

              <div className="card-info">
                <span
                  className={
                    challenge.frequency_type === "daily"
                      ? "frequency-daily"
                      : "frequency-weekly"
                  }
                >
                  {challenge.frequency_type === "daily"
                    ? "일일"
                    : `주 ${challenge.target_per_week}회`}
                </span>
                <span>
                  {formatDate(challenge.start_date)}
                  {challenge.end_date ? ` ~ ${formatDate(challenge.end_date)}` : ""}
                </span>
              </div>

              <div className="like-section">
                <FontAwesomeIcon
                  icon={
                    likes[challenge.challenge_id]?.liked
                      ? solidThumbsUp
                      : regularThumbsUp
                  }
                  onClick={(e) => toggleLike(challenge.challenge_id, e)}
                  className={`like-icon ${
                    likes[challenge.challenge_id]?.liked ? "liked" : ""
                  }`}
                />
                <span className="like-count">
                  {likes[challenge.challenge_id]?.count || 0}
                </span>

                <FontAwesomeIcon
                  icon={faUserPlus}
                  onClick={(e) => toggleParticipation(challenge.challenge_id, e)}
                  className={`join-icon ${
                    participants[challenge.challenge_id]?.joined ? "joined" : ""
                  }`}
                />
                <span className="join-count">
                  {participants[challenge.challenge_id]?.count || 0}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>

      <BottomNav setTab={setTab} />
    </div>
  );
}
