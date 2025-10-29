import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

const emojis = ['✏️', '📚', '📝', '📖', '🖍️'];
const NUM_EMOJIS = 10;

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fallingEmojis, setFallingEmojis] = useState([]);
    const navigate = useNavigate();

    // 이모지 떨어지는 애니메이션
    useEffect(() => {
        const ems = [];
        for (let i = 0; i < NUM_EMOJIS; i++) {
            ems.push({
                id: i,
                emoji: emojis[Math.floor(Math.random() * emojis.length)],
                left: Math.random() * 90 + '%',
                duration: 5 + Math.random() * 5,
                delay: Math.random() * 5,
            });
        }
        setFallingEmojis(ems);
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            alert('이메일과 비밀번호를 입력하세요');
            return;
        }

        try {
            const res = await axios.post(
                'http://127.0.0.1:3000/api/auth/login',
                { email, password },
                { withCredentials: true }
            );

            const data = res.data;

            if (data.ok) {
                console.log('✅ 저장할 유저 정보:', data.user);
                localStorage.setItem(
                    'user',
                    JSON.stringify({
                        user_id: data.user.id,
                        email: data.user.email,
                        username: data.user.username,
                    })
                );
                localStorage.setItem('accessToken', data.accessToken); // 선택

                navigate('/home');
            } else {
                alert(data.message || '이메일 또는 비밀번호를 확인하세요');
            }
        } catch (err) {
            console.error('❌ 로그인 요청 실패:', err);
            alert('로그인 중 오류가 발생했습니다. ' + err.message);
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
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    zIndex: 1,
                    position: 'relative',
                }}
            >
                <input type="email" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">로그인</button>
            </form>
            <p onClick={() => navigate('/register')} className="link">
                회원가입하기
            </p>
        </div>
    );
}
