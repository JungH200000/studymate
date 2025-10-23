// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faThumbsUp as solidThumbsUp,
  faUserPlus,
  faHandsClapping,
  faTrash
} from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp as regularThumbsUp } from "@fortawesome/free-regular-svg-icons";
import "./Home.css";

export default function Home() {
  const [tab, setTab] = useState("home");
  const [challenges, setChallenges] = useState([]);
  const [likes, setLikes] = useState({});
  const [cheers, setCheers] = useState({});
  const [participants, setParticipants] = useState({});
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
          fetchParticipants(data.challenges, storedUser.user_id);
          fetchCheers(data.challenges, storedUser.user_id);
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
          count: data.ok ? data.count : 0,
        };
      } catch {
        likesData[c.challenge_id] = { liked: false, count: 0 };
      }
    }
    setLikes(likesData);
  };

  const fetchCheers = async (challenges, userId) => {
    const cheerData = {};
    for (const c of challenges) {
      try {
        const res = await fetch(
          `http://localhost:3000/api/challenges/${c.challenge_id}/cheers?userId=${userId || ""}`
        );
        const data = await res.json();
        cheerData[c.challenge_id] = {
          cheered: data.ok ? data.cheered : false,
          count: data.ok ? data.count : 0,
        };
      } catch {
        cheerData[c.challenge_id] = { cheered: false, count: 0 };
      }
    }
    setCheers(cheerData);
  };

  const fetchParticipants = async (challenges, userId) => {
    const partData = {};
    for (const c of challenges) {
      try {
        const res = await fetch(
          `http://localhost:3000/api/challenges/${c.challenge_id}/participants?userId=${userId || ""}`
        );
        const data = await res.json();
        partData[c.challenge_id] = {
          joined: data.ok ? data.joined : false,
          count: data.ok ? data.count : 0,
        };
      } catch {
        partData[c.challenge_id] = { joined: false, count: 0 };
      }
    }
    setParticipants(partData);
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
          body: JSON.stringify({ userId }),
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
              : prev[challengeId].count - 1,
          },
        }));
      }
    } catch (err) {
      console.error("좋아요 처리 실패:", err);
    }
  };

  const toggleParticipation = async (challengeId, e) => {
    e.stopPropagation();
    if (!userId) return alert("로그인이 필요합니다.");

    try {
      const res = await fetch(
        `http://localhost:3000/api/challenges/${challengeId}/participants`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        }
      );
      const data = await res.json();
      if (data.ok) {
        setParticipants((prev) => ({
          ...prev,
          [challengeId]: {
            joined: data.joined,
            count: data.joined
              ? prev[challengeId].count + 1
              : prev[challengeId].count - 1,
          },
        }));
      }
    } catch (err) {
      console.error("참가 처리 실패:", err);
    }
  };

  const toggleCheer = async (challengeId, e) => {
    e.stopPropagation();
    if (!userId) return alert("로그인이 필요합니다.");

    try {
      const res = await fetch(
        `http://localhost:3000/api/challenges/${challengeId}/cheers`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        }
      );
      const data = await res.json();
      if (data.ok) {
        setCheers((prev) => ({
          ...prev,
          [challengeId]: {
            cheered: data.cheered,
            count: data.cheered
              ? prev[challengeId].count + 1
              : prev[challengeId].count - 1,
          },
        }));
      }
    } catch (err) {
      console.error("응원 처리 실패:", err);
    }
  };

const handleDelete = async (challengeId, e) => {
  e.stopPropagation();
  if (!window.confirm("정말 이 글을 삭제하시겠습니까?")) return;

  if (!userId) return alert("로그인이 필요합니다.");

  try {
    const res = await fetch(
      `http://localhost:3000/api/challenges/${challengeId}?userId=${userId}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    );

    let data;
    try {
      data = await res.json();
    } catch {
      data = { ok: false, message: "서버에서 올바른 JSON을 반환하지 않음" };
    }
    console.log("Parsed JSON:", data);

    if (data.ok) {
      setChallenges(prev => prev.filter(c => c.challenge_id !== challengeId));
      const { [challengeId]: _, ...restLikes } = likes;
      setLikes(restLikes);
      const { [challengeId]: __, ...restCheers } = cheers;
      setCheers(restCheers);
      const { [challengeId]: ___, ...restParticipants } = participants;
      setParticipants(restParticipants);
    } else {
      alert("삭제 실패: " + (data.message || "알 수 없는 오류"));
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
          {challenges.length === 0 && <p className="tab-message">등록된 챌린지가 없습니다.</p>}

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
                <span className={challenge.frequency_type === "daily" ? "frequency-daily" : "frequency-weekly"}>
                  {challenge.frequency_type === "daily" ? "일일" : `주 ${challenge.target_per_week}회`}
                </span>
                <span>
                  {challenge.start_date}
                  {challenge.end_date ? ` ~ ${challenge.end_date}` : ""}
                </span>
              </div>

              <div className="like-section">
                <FontAwesomeIcon
                  icon={likes[challenge.challenge_id]?.liked ? solidThumbsUp : regularThumbsUp}
                  onClick={(e) => toggleLike(challenge.challenge_id, e)}
                  className={`like-icon ${likes[challenge.challenge_id]?.liked ? "liked" : ""}`}
                />
                <span className="like-count">{likes[challenge.challenge_id]?.count || 0}</span>

                <FontAwesomeIcon
                  icon={faHandsClapping}
                  onClick={(e) => toggleCheer(challenge.challenge_id, e)}
                  className={`cheer-icon ${cheers[challenge.challenge_id]?.cheered ? "cheered" : ""}`}
                />
                <span className="cheer-count">{cheers[challenge.challenge_id]?.count || 0}</span>

                <FontAwesomeIcon
                  icon={faUserPlus}
                  onClick={(e) => toggleParticipation(challenge.challenge_id, e)}
                  className={`join-icon ${participants[challenge.challenge_id]?.joined ? "joined" : ""}`}
                />
                <span className="join-count">{participants[challenge.challenge_id]?.count || 0}</span>
              </div>
            </div>
          ))}
        </div>
      </main>

      <BottomNav setTab={setTab} />
    </div>
  );
}
