import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const emojis = ["✏️", "📚", "📝", "📖", "🖍️"];
const NUM_EMOJIS = 10;

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
        left: Math.random() * 90 + "%",
        duration: 5 + Math.random() * 5,
        delay: Math.random() * 5,
      });
    }
    setFallingEmojis(ems);
  }, []);


  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("이메일과 비밀번호를 입력하세요");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.ok) {
        // 로그인 성공 시 사용자 정보 localStorage 저장
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/home");
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("로그인 중 오류가 발생했습니다.");
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
