import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // useNavigate 추가
import "./ChallengeDetail.css";
import BottomNav from "../components/BottomNav";

export default function ChallengeDetail() {
  const { id } = useParams();
  const navigate = useNavigate(); // useNavigate 호출
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("detail");

  const handleCancel = () => {
    navigate("/home"); // 뒤로 가기
  };

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/challenges/${id}`);
        if (!res.ok) {
          console.error("서버 오류:", res.status);
          setChallenge(null);
          return;
        }
        const data = await res.json();
        if (data.ok) setChallenge(data.challenge);
      } catch (err) {
        console.error("챌린지 상세 조회 실패:", err);
        setChallenge(null);
      } finally {
        setLoading(false);
      }
    };
    fetchChallenge();
  }, [id]);

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
      <p>
        빈도: {challenge.frequency_type === "daily"
          ? "일일"
          : `주 ${challenge.target_per_week}회`}
      </p>
      <p>
        기간: {challenge.start_date}
        {challenge.end_date ? ` ~ ${challenge.end_date}` : ""}
      </p>
    </div>

    <BottomNav setTab={setTab} />
  </div>
);
}
