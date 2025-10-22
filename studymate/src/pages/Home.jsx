import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import "./Home.css";

export default function Home() {
  const [tab, setTab] = useState("home");
  const [challenges, setChallenges] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/challenges");
        if (!res.ok) {
          console.error("서버 오류:", res.status);
          return;
        }
        const data = await res.json();
        if (data.ok) setChallenges(data.challenges);
      } catch (err) {
        console.error("챌린지 가져오기 실패:", err);
      }
    };
    fetchChallenges();
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="home-container">
      {/* 헤더 */}
      <header className="home-header">
        <span className="refresh-emoji" onClick={handleRefresh} role="button">
          🔄
        </span>
        <div className="write-button">
          <p className="challenge-question" onClick={() => navigate("/write")}>
            누르면 작성탭으로 이동
          </p>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
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
              style={{ cursor: "pointer" }}
            >
              {/* 카드 상단: 프로필 + 이름 + 제목 */}
              <div className="card-top">
                <FontAwesomeIcon icon={faUser} className="profile-icon" />
                <div className="user-info">
                  <div className="card-username">{challenge.username}</div>
                  <div className="card-title">{challenge.title}</div>
                </div>
              </div>

              {/* 카드 내용 */}
              {challenge.content && (
                <div className="card-content">{challenge.content}</div>
              )}

              {/* 카드 정보: 빈도 + 기간 */}
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
            </div>
          ))}
        </div>
      </main>

      {/* 하단 네비 */}
      <BottomNav setTab={setTab} />
    </div>
  );
}
