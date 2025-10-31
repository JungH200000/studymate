import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BottomNav from "../components/BottomNav";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket,
  faUser,
  faThumbsUp as solidThumbsUp,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { fetchWithAuth } from "../api/auth";

import "./Profile.css";

export default function Profile({ setTab }) {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("닉네임");
  const [email, setEmail] = useState("");
  const [createdChallenges, setCreatedChallenges] = useState([]);
  const [joinedChallenges, setJoinedChallenges] = useState([]);

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const data = await fetchWithAuth("http://127.0.0.1:3000/api/me");
        if (data?.user?.username) {
          setNickname(data.user.username);
          setEmail(data.user.email);
        } else {
          console.warn("사용자 정보를 불러오지 못했습니다.");
        }
      } catch (err) {
        console.error("❌ 사용자 정보 요청 실패:", err);
      }
    };

    const loadChallenges = async () => {
      try {
        const created = await fetchWithAuth("http://127.0.0.1:3000/api/me/challenges?type=created");
        const joined = await fetchWithAuth("http://127.0.0.1:3000/api/me/challenges?type=joined");

        if (created?.challengesList) setCreatedChallenges(created.challengesList);
        if (joined?.challengesList) setJoinedChallenges(joined.challengesList);
      } catch (err) {
        console.error("❌ 챌린지 목록 요청 실패:", err);
      }
    };

    loadUserInfo();
    loadChallenges();
  }, [navigate]);

  const handleChallengeClick = (id) => {
    navigate(`/challenge/${id}`);
  };

  const handleLogout = async () => {
    const confirmLogout = window.confirm("로그아웃하시겠습니까?");
    if (!confirmLogout) return;

    try {
      await axios.post("http://127.0.0.1:3000/api/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("❌ 로그아웃 요청 실패:", err);
    }

    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  return (
    <div className="profile-container">
      <span className="logout-btn" onClick={handleLogout}>
        <FontAwesomeIcon icon={faArrowRightFromBracket} size="lg" />
      </span>

      <div className="profile-content">
        <span className="profile-name">{nickname}</span>
        <span className="profile-email">{email}</span>
        <FontAwesomeIcon icon={faUser} size="6x" className="profile-icon" />
      </div>

      <div className="challenge-section">
        <h3>내가 만든 챌린지</h3>
        {createdChallenges.map((challenge) => (
          <div key={challenge.challenge_id} className="challenge-card" onClick={() => handleChallengeClick(challenge.challenge_id)}>
            <h4>{challenge.title}</h4>
            <p>{challenge.content}</p>
            <div className="challenge-icons">
              <FontAwesomeIcon
                icon={solidThumbsUp}
                className={`like-icon ${challenge.liked_by_me ? "liked" : ""}`}
              />
              <span className="like-count">{challenge.like_count}</span>
              <FontAwesomeIcon
                icon={faUserPlus}
                className={`join-icon ${challenge.joined_by_me ? "joined" : ""}`}
              />
              <span className="join-count">{challenge.participant_count}</span>
            </div>
          </div>
        ))}

        <h3>내가 참여한 챌린지</h3>
        {joinedChallenges.map((challenge) => (
          <div key={challenge.challenge_id} className="challenge-card" onClick={() => handleChallengeClick(challenge.challenge_id)}>
            <h4>{challenge.title}</h4>
            <p>{challenge.content}</p>
            <div className="challenge-icons">
              <FontAwesomeIcon
                icon={solidThumbsUp}
                className={`like-icon ${challenge.liked_by_me ? "liked" : ""}`}
              />
              <span className="like-count">{challenge.like_count}</span>
              <FontAwesomeIcon
                icon={faUserPlus}
                className={`join-icon ${challenge.joined_by_me ? "joined" : ""}`}
              />
              <span className="join-count">{challenge.participant_count}</span>
            </div>
          </div>
        ))}
      </div>


      <BottomNav setTab={setTab} />
    </div>
  );
}
