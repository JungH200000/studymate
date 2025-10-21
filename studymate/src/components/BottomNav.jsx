import React from "react";
import { useNavigate } from "react-router-dom";
import "./BottomNav.css";

export default function BottomNav() {
  const navigate = useNavigate();

  return (
    <div className="bottom-nav">
      <button onClick={() => navigate("/home")}>홈</button>
      <button onClick={() => navigate("/write")}>글쓰기</button>
      <button onClick={() => navigate("/profile")}>프로필</button>
    </div>
  );
}
