import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs"; // bcrypt import
import "./Auth.css";

const emojis = ["✏️", "📚", "📝", "📖", "🖍️"];
const NUM_EMOJIS = 10;

export default function Signup() {
  const [username, setUsername] = useState("");
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

  const handleSignup = (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      return alert("모든 항목을 입력하세요.");
    }

    const salt = bcrypt.genSaltSync(10);
    const password_hash = bcrypt.hashSync(password, salt);

    const userData = {
      username: username,
      email: email,
      password_hash: password_hash,
    };

    localStorage.setItem("user", JSON.stringify(userData));
    alert("회원가입 완료!");
    navigate("/home");
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

      <h2>회원가입</h2>
      <form
        onSubmit={handleSignup}
        style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 1, position: "relative" }}
      >
        <input
          type="text"
          placeholder="닉네임"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
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
        <button type="submit">가입하기</button>
      </form>
      <p onClick={() => navigate("/login")} className="link">
        로그인으로 돌아가기
      </p>
    </div>
  );
}
