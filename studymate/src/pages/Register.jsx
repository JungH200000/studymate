import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../api/config';
import './Auth.css';

const EMOJIS = ['✏️', '📚', '📝', '📖', '🖍️'];
const EMOJI_COUNT = 10;

export default function Signup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fallingEmojis, setFallingEmojis] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const generatedEmojis = Array.from({ length: EMOJI_COUNT }, (_, i) => ({
            id: i,
            emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
            left: `${Math.random() * 90}%`,
            duration: 5 + Math.random() * 5,
            delay: Math.random() * 5,
        }));
        setFallingEmojis(generatedEmojis);
    }, []);

    const handleSignup = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${API_BASE}/api/auth/register`, {
                username,
                email,
                password,
            });

            const { ok, user, message } = response.data;

            alert(message || (ok ? '회원가입 완료!' : '회원가입 실패'));

            if (ok) {
                localStorage.setItem('user', JSON.stringify(user));
                navigate('/login');
            }
        } catch (error) {
            console.error('❌ 회원가입 오류:', error);

            const errorMessage = error.response?.data?.message || '회원가입 중 오류가 발생했습니다.';
            alert(errorMessage);
        }
    };

    return (
        <div className="auth-container">
            {fallingEmojis.map(({ id, emoji, left, duration, delay }) => (
                <span
                    key={id}
                    className="falling-emoji"
                    style={{
                        left,
                        animationDuration: `${duration}s`,
                        animationDelay: `${delay}s`,
                    }}
                >
                    {emoji}
                </span>
            ))}

            <h2>회원가입</h2>

            <form onSubmit={handleSignup} className="auth-form">
                <input
                    type="text"
                    placeholder="닉네임"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input type="email" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} />

                <input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit">가입하기</button>
            </form>

            <p className="link" onClick={() => navigate('/login')}>
                로그인으로 돌아가기
            </p>
        </div>
    );
}
