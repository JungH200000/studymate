import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const emojis = ["✏️", "📚", "📝", "📖", "🖍️"]; // 원하는 이모지 배열
const NUM_EMOJIS = 10; // 동시에 화면에 떨어지는 이모지 수

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fallingEmojis, setFallingEmojis] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const ems = [];
    for (let i = 0; i < NUM_EMOJIS; i++) {
      ems.push({
        id: i,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        left: Math.random() * 90 + "%", // 랜덤 가로 위치
        duration: 5 + Math.random() * 5, // 5~10초 사이 속도
        delay: Math.random() * 5, // 랜덤 딜레이
      });
    }
    setFallingEmojis(ems);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      localStorage.setItem("user", email);
      navigate("/home");
    } else {
      alert("이메일과 비밀번호를 입력하세요");
    }
  };

  return (
    <div className="auth-container">
      {/* 이모지 애니메이션 */}
      {fallingEmojis.map((em) => (
        <span
          key={em.id}
          className="falling-emoji"
          style={{
            left: em.left,
            animationDuration: `${em.duration}s`,
            animationDelay: `${em.delay}s`,
          }}
        >
          {em.emoji}
        </span>
      ))}

      <h2>로그인</h2>
      <form
        onSubmit={handleLogin}
        style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 1, position: "relative" }}
      >
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">로그인</button>
      </form>
      <p onClick={() => navigate("/signup")} className="link">
        회원가입하기
      </p>
    </div>
  );
}
