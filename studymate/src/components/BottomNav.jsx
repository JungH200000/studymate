import React from "react";
import { useNavigate, useLocation  } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faPen, faUser } from "@fortawesome/free-solid-svg-icons"; // 아이콘 import
import "./BottomNav.css";

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="bottom-nav">
      <button onClick={() => navigate("/home")}
      className={currentPath === "/home" ? "active" : ""}
        >
        <FontAwesomeIcon icon={faHouse} />
      </button>
      <button onClick={() => navigate("/write")}
        className={currentPath === "/write" ? "active" : ""}>
        <FontAwesomeIcon icon={faPen} />
      </button>
      <button onClick={() => navigate("/profile")}
        className={currentPath === "/profile" ? "active" : ""}>
        <FontAwesomeIcon icon={faUser} />
      </button>
    </div>
  );
}