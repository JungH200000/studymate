import React, { useEffect, useState } from 'react';
import { fetchWithAuth } from '../api/auth';
import { useParams, useNavigate } from 'react-router-dom';
import AchievementChart from '../components/AchievementChart';
import { API_BASE } from '../api/config';
import './Achievement.css';

export default function Achievement() {
    const navigate = useNavigate();
    const { id: userId } = useParams();
    const [weeklyFullRate, setWeeklyFullRate] = useState(0);
    const [totalRate, setTotalRate] = useState(0);
    const [day30Rate, setDay30Rate] = useState(0);
    const [userPosts, setUserPosts] = useState([]);

    useEffect(() => {
        const loadUserPosts = async () => {
            try {
                const weekRes = await fetchWithAuth(`${API_BASE}/api/challenges/${userId}/progress/week`);
                const challengeIds = weekRes?.achievedChallengesList?.map((c) => c.challenge_id) ?? [];

                const postPromises = challengeIds.map((id) =>
                    fetchWithAuth(`${API_BASE}/api/challenges/${id}/posts`)
                );
                const postResults = await Promise.all(postPromises);

                const allPosts = postResults.flatMap((res) =>
                    res?.postsList?.filter((post) => post.user_id === userId) ?? []
                );

                setUserPosts(allPosts);
                
            } catch (err) {
                console.error('❌ 인증글 불러오기 실패:', err);
            }
        };

        const loadAchievementRates = async () => {
            try {
                const [weekRes, totalRes, day30Res] = await Promise.all([
                    fetchWithAuth(`${API_BASE}/api/challenges/${userId}/progress/week`),
                    fetchWithAuth(`${API_BASE}/api/challenges/${userId}/progress/total`),
                    fetchWithAuth(`${API_BASE}/api/challenges/${userId}/progress/30days`),
                ]);

                const weekRate = parseFloat(weekRes?.weekly?.weeklyFullRate ?? 0);
                const total = parseFloat(totalRes?.total?.totalRate ?? 0);
                const day30 = parseFloat(day30Res?.day30?.day30Rate ?? 0);

                setWeeklyFullRate(weekRate);
                setTotalRate(total);
                setDay30Rate(day30);
            } catch (err) {
                console.error('❌ 사용자 인증률 요청 실패:', err);
            }
        };

        loadUserPosts();
        loadUserPosts();
        loadAchievementRates();
    }, [userId]);

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="achievement-container">
            {/* 상단 헤더 바: 뒤로가기 버튼과 제목 배치 */}
            <div className="header-bar">
                <button className="back-button" onClick={handleGoBack}>
                    <span className="back-icon">←</span>
                </button>
                <h2 className="page-title">📊 내 챌린지 기록</h2>
            </div>

            <div className="rate-stats-grid">
                <div className="stat-card weekly">
                    <p className="stat-label">이번 주 인증률</p>
                    {/* ✅ 소수점 제거: toFixed(0) 적용 */}
                    <p className="stat-value">{(weeklyFullRate * 100).toFixed(0)}%</p>
                </div>
                <div className="stat-card day30">
                    <p className="stat-label">30일 인증률</p>
                    {/* ✅ 소수점 제거: toFixed(0) 적용 */}
                    <p className="stat-value">{(day30Rate * 100).toFixed(0)}%</p>
                </div>
                <div className="stat-card total">
                    <p className="stat-label">전체 인증률</p>
                    {/* ✅ 소수점 제거: toFixed(0) 적용 */}
                    <p className="stat-value">{(totalRate * 100).toFixed(0)}%</p>
                </div>
            </div>

            <AchievementChart
                totalRate={totalRate}
                day30Rate={day30Rate}
                posts={userPosts}
                userId={userId}
            />

        </div>
    );
}
