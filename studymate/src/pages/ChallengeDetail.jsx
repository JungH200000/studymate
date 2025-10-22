import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ChallengeDetail.css";
import BottomNav from "../components/BottomNav";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp as solidThumb } from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp as regularThumb } from "@fortawesome/free-regular-svg-icons";

export default function ChallengeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("detail");
  const [likes, setLikes] = useState({ liked: false, count: 0 });
  const [userId, setUserId] = useState(null);

  const handleCancel = () => navigate("/home");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (storedUser.user_id) setUserId(storedUser.user_id);

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

    const fetchLikes = async () => {
      if (!id) return;
      try {
        const queryString = userId ? `?userId=${userId}` : "";
        const res = await fetch(
          `http://localhost:3000/api/challenges/${id}/likes${queryString}`
        );
        const data = await res.json();
        if (data.ok) setLikes({ liked: data.liked, count: data.count });
      } catch (err) {
        console.error("좋아요 상태 가져오기 실패:", err);
      }
    };

    fetchChallenge();
    fetchLikes();
  }, [id, userId]);

  const toggleLike = async () => {
    if (!userId) return alert("로그인이 필요합니다.");
    try {
      const res = await fetch(`http://localhost:3000/api/challenges/${id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      });
      const data = await res.json();
      if (data.ok) setLikes({ liked: data.liked, count: data.count });
    } catch (err) {
      console.error("좋아요 처리 실패:", err);
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
        <p>
          빈도: {challenge.frequency_type === "daily"
            ? "일일"
            : `주 ${challenge.target_per_week}회`}
        </p>
        <p>
          기간: {challenge.start_date}
          {challenge.end_date ? ` ~ ${challenge.end_date}` : ""}
        </p>

        {/* 좋아요 버튼 - 엄지 아이콘 */}
        <div className="like-section">
          <FontAwesomeIcon
            icon={likes.liked ? solidThumb : regularThumb}
            onClick={toggleLike}
            style={{
              color: likes.liked ? "blue" : "gray",
              cursor: "pointer",
              marginRight: "5px"
            }}
          />
          <span>{likes.count}</span>
        </div>
      </div>

      <BottomNav setTab={setTab} />
    </div>
  );
}
