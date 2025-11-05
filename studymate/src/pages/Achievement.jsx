import React, { useEffect, useState } from 'react';
import { fetchWithAuth } from '../api/auth';
import { useParams, useNavigate } from 'react-router-dom';
import AchievementChart from '../components/AchievementChart';
import './Achievement.css';

export default function Achievement() {
    const navigate = useNavigate();
    const [weeklyFullRate, setWeeklyFullRate] = useState(0);
    const [totalRate, setTotalRate] = useState(0);
    const [day30Rate, setDay30Rate] = useState(0);
    const { id: userId } = useParams();

    useEffect(() => {
        const loadAchievementRates = async () => {
            try {
                const [weekRes, totalRes, day30Res] = await Promise.all([
                    fetchWithAuth(`http://127.0.0.1:3000/api/challenges/${userId}/progress/week`),
                    fetchWithAuth(`http://127.0.0.1:3000/api/challenges/${userId}/progress/total`),
                    fetchWithAuth(`http://127.0.0.1:3000/api/challenges/${userId}/progress/30days`)
                ]);

                const weekRate = parseFloat(weekRes?.week?.weeklyFullRate ?? 0);
                const total = parseFloat(totalRes?.total?.totalRate ?? 0);
                const day30 = parseFloat(day30Res?.day30?.day30Rate ?? 0);

                setWeeklyFullRate(weekRate);
                setTotalRate(total);
                setDay30Rate(day30);
            } catch (err) {
                console.error('❌ 사용자 인증률 요청 실패:', err);
            }
        };

        loadAchievementRates();
    }, [userId]);

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="achievement-container">
            <button className="back-button" onClick={handleGoBack}>뒤로가기</button>
            <h2>📊 내 챌린지 기록</h2>
            <AchievementChart totalRate={totalRate} day30Rate={day30Rate} />
        </div>
    );
}
