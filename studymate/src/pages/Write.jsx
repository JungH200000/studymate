import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Write.css';
import { fetchWithAuth } from '../api/auth';
import { API_BASE } from '../api/config';

export default function Write() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [frequencyType, setFrequencyType] = useState('daily');
    const [targetPerWeek, setTargetPerWeek] = useState(1);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleCancel = () => {
        if (window.confirm('작성 취소하시겠습니까?')) navigate('/home');
    };

    const handlePost = async () => {
        if (!title) return alert('챌린지 제목을 입력하세요.');
        if (frequencyType === 'weekly' && (!targetPerWeek || targetPerWeek < 1))
            return alert('주간 빈도를 1회 이상으로 입력하세요.');
        if (!startDate) return alert('시작일을 입력하세요.');

        const payload = {
            title,
            content,
            frequency_type: frequencyType,
            target_per_week: frequencyType === 'weekly' ? targetPerWeek : null,
            start_date: startDate,
            end_date: endDate || null,
        };

        try {
            const res = await fetchWithAuth(`${API_BASE}/api/challenges`, {
                method: 'POST',
                body: payload,
            });

            if (res?.ok) {
                alert('챌린지 등록 완료!');
                navigate('/home');
            } else {
                alert(res?.message || '챌린지 등록 실패');
            }
        } catch (err) {
            console.error('등록 오류:', err);
            alert('챌린지 등록 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="write-container">
            <header className="write-header">
                <span className="cancel-icon" onClick={handleCancel}>
                    ❌
                </span>
                <h2 className="header-title">새 챌린지 작성</h2>
            </header>

            <div className="write-form">
                <input
                    type="text"
                    placeholder="챌린지 제목을 입력하세요"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="write-title"
                />

                <textarea
                    placeholder="챌린지 내용을 입력하세요"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="write-content"
                />

                <div className="write-frequency">
                    <label>빈도 유형</label>
                    <select value={frequencyType} onChange={(e) => setFrequencyType(e.target.value)}>
                        <option value="daily">일일</option>
                        <option value="weekly">주간</option>
                    </select>

                    {frequencyType === 'weekly' && (
                        <>
                            <label>일주일에 몇 번?</label>
                            <select value={targetPerWeek} onChange={(e) => setTargetPerWeek(parseInt(e.target.value))}>
                                {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                                    <option key={n} value={n}>
                                        {n}회
                                    </option>
                                ))}
                            </select>
                        </>
                    )}
                </div>

                <div className="write-dates">
                    <div className="date-field">
                        <label>시작일</label>
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </div>
                    <div className="date-field">
                        <label>종료일</label>
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                </div>

                <button className="post-btn" onClick={handlePost}>
                    등록하기
                </button>
            </div>
        </div>
    );
}
