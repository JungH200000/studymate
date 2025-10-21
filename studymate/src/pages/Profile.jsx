import React from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import "./Profile.css";

export default function Profile({ setTab }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("로그아웃하시겠습니까?")) {
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  const nickname = localStorage.getItem("user") || "닉네임";

  return (
    <div className="profile-container">
      {/* 상단 로그아웃 버튼 */}
      <button className="logout-btn" onClick={handleLogout}>
        로그아웃
      </button>

      {/* 프로필 영역 */}
      <div className="profile-content">
        <span className="profile-name">{nickname}</span>
        <img
          src="https://via.placeholder.com/100"
          className="profile-image"
        />
      </div>

      {/* 하단 네비게이션 */}
      <BottomNav setTab={setTab} />
    </div>
  );
}
