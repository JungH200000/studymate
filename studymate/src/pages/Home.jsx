// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { fetchWithAuth } from "../api/auth";
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

const API_BASE = "http://127.0.0.1:3000/api";

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

    const loadChallenges = async () => {
      try {
        const res = await axios.get(`${API_BASE}/challenges`, { withCredentials: true });
        if (res.data && res.data.ok) {
          const list = Array.isArray(res.data.challenges) ? res.data.challenges : [];
          setChallenges(list);
          loadLikesStatus(list, storedUser.user_id);
          loadParticipantsStatus(list, storedUser.user_id);
          loadCheersStatus(list, storedUser.user_id);
        } else {
          console.error("챌린지 응답 형식 오류:", res.data);
        }
      } catch (err) {
        console.error("챌린지 가져오기 실패:", err);
      }
    };
    loadChallenges();
  }, []);

  const loadLikesStatus = async (challengesList, uid) => {
    const likesData = {};
    await Promise.all(
      challengesList.map(async (c) => {
        try {
          const res = await axios.get(`${API_BASE}/challenges/${c.challenge_id}/likes`, {
            params: { userId: uid || "" },
            withCredentials: true,
          });
          likesData[c.challenge_id] = {
            liked: res.data?.ok ? !!res.data.liked : false,
            count: res.data?.ok ? Number(res.data.count || 0) : 0,
          };
        } catch (e) {
          likesData[c.challenge_id] = { liked: false, count: 0 };
        }
      })
    );
    setLikes(likesData);
  };

  const loadCheersStatus = async (challengesList, uid) => {
    const cheerData = {};
    await Promise.all(
      challengesList.map(async (c) => {
        try {
          const res = await axios.get(`${API_BASE}/challenges/${c.challenge_id}/cheers`, {
            params: { userId: uid || "" },
            withCredentials: true,
          });
          cheerData[c.challenge_id] = {
            cheered: res.data?.ok ? !!res.data.cheered : false,
            count: res.data?.ok ? Number(res.data.count || 0) : 0,
          };
        } catch {
          cheerData[c.challenge_id] = { cheered: false, count: 0 };
        }
      })
    );
    setCheers(cheerData);
  };

  const loadParticipantsStatus = async (challengesList, uid) => {
    const partData = {};
    await Promise.all(
      challengesList.map(async (c) => {
        try {
          const res = await axios.get(`${API_BASE}/challenges/${c.challenge_id}/participants`, {
            params: { userId: uid || "" },
            withCredentials: true,
          });
          partData[c.challenge_id] = {
            joined: res.data?.ok ? !!res.data.joined : false,
            count: res.data?.ok ? Number(res.data.count || 0) : 0,
          };
        } catch {
          partData[c.challenge_id] = { joined: false, count: 0 };
        }
      })
    );
    setParticipants(partData);
  };

  const handleRefresh = () => window.location.reload();

  const toggleLike = async (challengeId, e) => {
    e.stopPropagation();
    if (!userId) return alert("로그인이 필요합니다.");

    try {
      const res = await fetchWithAuth(`${API_BASE}/challenges/${challengeId}/like`, {
        method: "POST",
        body: { userId },
      });

      if (res?.ok) {
        setLikes((prev) => ({
          ...prev,
          [challengeId]: {
            liked: !!res.liked,
            count: res.liked
              ? (prev[challengeId]?.count ?? 0) + 1
              : Math.max(0, (prev[challengeId]?.count ?? 0) - 1),
          },
        }));
      } else {
        console.warn("좋아요 응답 오류:", res);
      }
    } catch (err) {
      console.error("좋아요 처리 실패:", err);
    }
  };

  const toggleParticipation = async (challengeId, e) => {
    e.stopPropagation();
    if (!userId) return alert("로그인이 필요합니다.");

    try {
      const res = await fetchWithAuth(`${API_BASE}/challenges/${challengeId}/participants`, {
        method: "POST",
        body: { userId },
      });

      if (res?.ok) {
        setParticipants((prev) => ({
          ...prev,
          [challengeId]: {
            joined: !!res.joined,
            count: res.joined
              ? (prev[challengeId]?.count ?? 0) + 1
              : Math.max(0, (prev[challengeId]?.count ?? 0) - 1),
          },
        }));
      } else {
        console.warn("참가 응답 오류:", res);
      }
    } catch (err) {
      console.error("참가 처리 실패:", err);
    }
  };

  const toggleCheer = async (challengeId, e) => {
    e.stopPropagation();
    if (!userId) return alert("로그인이 필요합니다.");

    try {
      const res = await fetchWithAuth(`${API_BASE}/challenges/${challengeId}/cheers`, {
        method: "POST",
        body: { userId },
      });

      if (res?.ok) {
        setCheers((prev) => ({
          ...prev,
          [challengeId]: {
            cheered: !!res.cheered,
            count: res.cheered
              ? (prev[challengeId]?.count ?? 0) + 1
              : Math.max(0, (prev[challengeId]?.count ?? 0) - 1),
          },
        }));
      } else {
        console.warn("응원 응답 오류:", res);
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
      const res = await fetchWithAuth(`${API_BASE}/challenges/${challengeId}`, {
        method: "DELETE",
        body: { userId },
      });

      if (res?.ok) {
        setChallenges((prev) => prev.filter((c) => c.challenge_id !== challengeId));
        const { [challengeId]: _, ...restLikes } = likes;
        setLikes(restLikes);
        const { [challengeId]: __, ...restCheers } = cheers;
        setCheers(restCheers);
        const { [challengeId]: ___, ...restParticipants } = participants;
        setParticipants(restParticipants);
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
