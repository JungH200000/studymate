import React from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket, faUser } from "@fortawesome/free-solid-svg-icons"; // faUser 추가

import "./Profile.css";

export default function Profile({ setTab }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("로그아웃하시겠습니까?")) {
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  // localStorage에서 user 정보 가져오기
  const userData = localStorage.getItem("user");
  let nickname = "닉네임";

  if (userData) {
    try {
      const user = JSON.parse(userData);
      nickname = user.username;
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="profile-container">
      {/* 상단 로그아웃 버튼 */}
      <span className="logout-btn" onClick={handleLogout}>
        <FontAwesomeIcon icon={faArrowRightFromBracket} size="lg" />
      </span>

      {/* 프로필 영역 */}
      <div className="profile-content">
        <span className="profile-name">{nickname}</span>
        <FontAwesomeIcon
          icon={faUser}
          size="6x"
          className="profile-icon"
        />
      </div>

      {/* 하단 네비게이션 */}
      <BottomNav setTab={setTab} />
    </div>
  );
}
