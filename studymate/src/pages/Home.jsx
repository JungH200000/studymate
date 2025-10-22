// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faUser,faThumbsUp as solidThumbsUp} from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp as regularThumbsUp } from "@fortawesome/free-regular-svg-icons";
import "./Home.css";

export default function Home() {
  const [tab, setTab] = useState("home");
  const [challenges, setChallenges] = useState([]);
  const [likes, setLikes] = useState({}); // { [challengeId]: { liked: true/false, count: number } }
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (storedUser.user_id) setUserId(storedUser.user_id);

    const fetchChallenges = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/challenges");
        if (!res.ok) return console.error("서버 오류:", res.status);

        const data = await res.json();
        if (data.ok) {
          setChallenges(data.challenges);
          fetchLikesStatus(data.challenges, storedUser.user_id);
        }
      } catch (err) {
        console.error("챌린지 가져오기 실패:", err);
      }
    };
    fetchChallenges();
  }, []);

  const fetchLikesStatus = async (challenges, userId) => {
    const likesData = {};
    for (const c of challenges) {
      try {
        const res = await fetch(
          `http://localhost:3000/api/challenges/${c.challenge_id}/likes?userId=${userId || ""}`
        );
        const data = await res.json();
        likesData[c.challenge_id] = {
          liked: data.ok ? data.liked : false,
          count: data.ok ? data.count : 0
        };
      } catch (err) {
        console.error("좋아요 상태 가져오기 실패:", err);
        likesData[c.challenge_id] = { liked: false, count: 0 };
      }
    }
    setLikes(likesData);
  };

  const handleRefresh = () => window.location.reload();

  const toggleLike = async (challengeId, e) => {
    e.stopPropagation();
    if (!userId) return alert("로그인이 필요합니다.");

    try {
      const res = await fetch(
        `http://localhost:3000/api/challenges/${challengeId}/like`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId })
        }
      );
      const data = await res.json();
      if (data.ok) {
        setLikes((prev) => ({
          ...prev,
          [challengeId]: {
            liked: data.liked,
            count: data.liked
              ? prev[challengeId].count + 1
              : prev[challengeId].count - 1
          }
        }));
      }
    } catch (err) {
      console.error("좋아요 처리 실패:", err);
    }
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <span className="refresh-emoji" onClick={handleRefresh}>
          🔄
        </span>
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
                  <div className="card-username">{challenge.username}</div>
                  <div className="card-title">{challenge.title}</div>
                </div>
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
                  {challenge.start_date}
                  {challenge.end_date ? ` ~ ${challenge.end_date}` : ""}
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
                    className="like-icon"
                    style={{
                      color: likes[challenge.challenge_id]?.liked
                        ? "blue"
                        : "gray",
                      cursor: "pointer"
                    }}
                  />
                  <span className="like-count">
                    {likes[challenge.challenge_id]?.count || 0}
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
