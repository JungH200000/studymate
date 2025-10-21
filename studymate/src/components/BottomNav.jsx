import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faPen, faUser } from "@fortawesome/free-solid-svg-icons"; // 아이콘 import
import "./BottomNav.css";

export default function BottomNav() {
  const navigate = useNavigate();

  return (
    <div className="bottom-nav">
      <button onClick={() => navigate("/home")}>
        <FontAwesomeIcon icon={faHouse} />
      </button>
      <button onClick={() => navigate("/write")}>
        <FontAwesomeIcon icon={faPen} />
      </button>
      <button onClick={() => navigate("/profile")}>
        <FontAwesomeIcon icon={faUser} />
      </button>
    </div>
  );
}
