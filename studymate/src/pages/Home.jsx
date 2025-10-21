import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import "./Home.css";

export default function Home() {
  const [tab, setTab] = useState("home");
  const navigate = useNavigate();

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="home-container">
      {/* 상단 헤더 */}
      <header className="home-header">
        <span className="refresh-emoji" onClick={handleRefresh} role="button">
          🔄
        </span>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="home-content">
        <p
          className="challenge-question"
          onClick={() => navigate("/write")}
        >
          누르면 작성탭으로 이동
        </p>

        <div className="post-list">
          <p>여기에 글 목록 표시 예정</p>
        </div>
      </main>
      
      <BottomNav setTab={setTab} />
    </div>
  );
}
