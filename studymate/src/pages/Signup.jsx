import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";  // bcrypt import
import "./Auth.css";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

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
      <h2>회원가입</h2>
      <form
        onSubmit={handleSignup}
        style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
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
      <p onClick={() => navigate("/")} className="link">
        로그인으로 돌아가기
      </p>
    </div>
  );
}
