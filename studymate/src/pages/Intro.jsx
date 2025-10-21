import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Intro.css";

export default function Intro() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 3000); // 3초 후 이동

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="intro-container">
      <h1>📚 StudyMate</h1>
      <p>당신의 공부 목표를 함께 관리하세요!</p>
    </div>
  );
}
