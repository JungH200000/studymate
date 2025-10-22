import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./Write.css";

export default function Write({ setTab }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [frequencyType, setFrequencyType] = useState("daily");
  const [targetPerWeek, setTargetPerWeek] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleCancel = () => {
    if (window.confirm("작성 취소하시겠습니까?")) navigate("/home");
  };

  const handlePost = async () => {
    if (!title) return alert("챌린지 제목을 입력하세요.");
    if (frequencyType === "weekly" && (!targetPerWeek || targetPerWeek < 1))
      return alert("주간 빈도를 1회 이상으로 입력하세요.");
    if (!startDate) return alert("시작일을 입력하세요.");

    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    if (!userData.user_id) return alert("로그인이 필요합니다.");

    const payload = {
      title,
      content,
      frequencyType,
      targetPerWeek: frequencyType === "weekly" ? targetPerWeek : null,
      startDate,
      endDate: endDate || null,
      creatorId: userData.user_id
    };

    try {
      const res = await axios.post("http://localhost:3000/api/challenges", payload);
      if (res.data.ok) {
        alert("챌린지 등록 완료!");
        navigate("/home");
      }
    } catch (err) {
      console.error(err);
      alert("챌린지 등록 실패");
    }
  };

  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const nickname = userData.username || "닉네임";

  return (
    <div className="write-container">
      <header className="write-header">
        <span className="cancel-btn" onClick={handleCancel}>❌</span>
      </header>

      <div className="write-profile">
        <FontAwesomeIcon icon={faUser} size="2x" className="profile-icon" />
        <span className="username">{nickname}</span>
      </div>

      <input
        type="text"
        placeholder="제목 입력"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="write-title"
      />

      <textarea
        placeholder="내용 입력"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="write-content"
      />

      <div className="write-frequency">
        <label>빈도 유형</label>
        <select
          value={frequencyType}
          onChange={(e) => setFrequencyType(e.target.value)}
        >
          <option value="daily">일일</option>
          <option value="weekly">주간</option>
        </select>

        {frequencyType === "weekly" && (
          <>
            <label>일주일에 몇 번?</label>
            <select
              value={targetPerWeek}
              onChange={(e) => setTargetPerWeek(parseInt(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                <option key={n} value={n}>{n}회</option>
              ))}
            </select>
          </>
        )}
      </div>

      <div className="write-dates">
        <label>시작일</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <label>종료일</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      <button className="post-btn" onClick={handlePost}>
        게시
      </button>
    </div>
  );
}
