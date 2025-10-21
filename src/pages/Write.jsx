import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Write.css';

export default function Write({ setTab }) {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [frequency, setFrequency] = useState(1); // 기본 1회/주

    const handleCancel = () => {
        if (window.confirm('작성 취소하시겠습니까?')) navigate('/home');
    };

    const handlePost = () => {
        if (!title) return alert('챌린지 제목을 입력하세요.');

        if (window.confirm('게시하시겠습니까?')) {
            // 실제 게시 로직 (API 호출) 추가 가능
            navigate('/home');
        }
    };

    return (
        <div className="write-container">
            <header className="write-header">
                <span className="cancel-btn" onClick={handleCancel}>
                    ❌
                </span>
            </header>

            <div className="write-profile">
                <img src="https://via.placeholder.com/50" alt="프로필" className="profile-img" />
                <span className="username">닉네임</span>
            </div>

            {/* 제목 */}
            <input
                type="text"
                placeholder="제목 입력"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="write-title"
            />

            {/* 빈도 선택 */}
            <div className="write-frequency">
                <label>일주일에 몇 번?</label>
                <select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
                    {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                        <option key={n} value={n}>
                            {n}회
                        </option>
                    ))}
                </select>
            </div>

            <button className="post-btn" onClick={handlePost}>
                게시
            </button>
        </div>
    );
}
