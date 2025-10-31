import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BottomNav from "../components/BottomNav";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket, faUser } from "@fortawesome/free-solid-svg-icons";
import { fetchWithAuth } from "../api/auth";

import "./Profile.css";

export default function Profile({ setTab }) {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("닉네임");
  const [email, setEmail] = useState("");

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

    loadUserInfo();
  }, [navigate]);

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

      <BottomNav setTab={setTab} />
    </div>
  );
}
