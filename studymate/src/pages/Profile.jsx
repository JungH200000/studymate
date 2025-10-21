import React from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";

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
      <span className="logout-btn" onClick={handleLogout}>
        <FontAwesomeIcon icon={faArrowRightFromBracket} size="lg" />
      </span>


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
