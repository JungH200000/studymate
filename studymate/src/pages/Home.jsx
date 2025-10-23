import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faThumbsUp, faBell } from '@fortawesome/free-solid-svg-icons';
import { faComment as farComment } from '@fortawesome/free-regular-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSearch, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import './Home.css';

library.add(faSearch, faUserGroup);

export default function Home() {
    const [tab, setTab] = useState('home');
    const [challenges, setChallenges] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                const res = await fetch('http://localhost:3000/api/challenges');
                if (!res.ok) return console.error('서버 오류:', res.status);
                const data = await res.json();
                if (data.ok) {
                    const mapped = data.challenges.map((c) => ({
                        challenge_id: c.challenge_id,
                        username: c.username || c.user_name || '익명',
                        completion_rate: c.completion_rate || '0%',
                        date: c.start_date,
                        frequency_type: c.frequency_type,
                        target_per_week: c.target_per_week,
                        title: c.title,
                        content: c.content,
                        subtitle: c.subtitle,
                        likes: c.likes_count || 0,
                        cheers: c.comments_count || 0,
                        participants: c.participants_count || 0,
                    }));
                    setChallenges(mapped);
                }
            } catch (err) {
                console.error('챌린지 가져오기 실패:', err);
            }
        };
        fetchChallenges();
    }, []);

    const handleMenuClick = () => console.log('메뉴 클릭');
    const handleSearchClick = () => console.log('검색 클릭');
    const handleJoinClick = (challenge_id) => (e) => {
        e.stopPropagation();
        setChallenges((prev) =>
            prev.map((c) => (c.challenge_id === challenge_id ? { ...c, participants: c.participants + 1 } : c))
        );
    };
    const handleReportClick = (challenge_id) => (e) => {
        e.stopPropagation();
        console.log(`${challenge_id} 신고`);
    };

    const handleLikeClick = (challenge_id, e) => {
        e.stopPropagation();
        setChallenges((prev) => prev.map((c) => (c.challenge_id === challenge_id ? { ...c, likes: c.likes + 1 } : c)));
    };

    const handleCheerClick = (challenge_id, e) => {
        e.stopPropagation();
        setChallenges((prev) =>
            prev.map((c) => (c.challenge_id === challenge_id ? { ...c, cheers: c.cheers + 1 } : c))
        );
    };

    return (
        <div className="home-container">
            <header className="home-header">
                <div className="header-bar">
                    <div className="icon-left" onClick={handleMenuClick}>
                        <div className="hamburger-menu">
                            <span className="line"></span>
                            <span className="line"></span>
                            <span className="line"></span>
                        </div>
                    </div>
                    <div className="header-logo">
                        <img src="/logo.svg" alt="Logo" className="logo-icon" />
                        <span className="logo-text">s</span>
                    </div>
                    <div className="icon-right" onClick={handleSearchClick}>
                        <FontAwesomeIcon icon="search" className="search-icon" />
                    </div>
                </div>
                <p className="challenge-question">도전하고 싶은 챌린지가 있나요??</p>
            </header>

            <main className="home-content">
                <div className="post-list">
                    {challenges.length === 0 && <p className="tab-message">등록된 챌린지가 없습니다.</p>}

                    {challenges.map((challenge) => (
                        <div
                            className="challenge-card"
                            key={challenge.challenge_id}
                            onClick={() => navigate(`/challenge/${challenge.challenge_id}`)}
                        >
                            {/* 카드 상단 */}
                            <div className="card-top-header">
                                <div className="card-top-left">
                                    <FontAwesomeIcon icon={faUser} className="profile-icon" />
                                    <div className="user-info">
                                        <div className="card-username-line">
                                            <div className="card-username">{challenge.username}</div>
                                            <div className="card-date">{challenge.date}</div>
                                        </div>
                                        <div className="card-completion-rate">달성률 {challenge.completion_rate}</div>
                                    </div>
                                </div>
                                <div
                                    className="report-button"
                                    onClick={(e) => handleReportClick(challenge.challenge_id)(e)}
                                >
                                    <FontAwesomeIcon icon={faBell} className="report-icon" />
                                </div>
                            </div>

                            {/* 제목 */}
                            <div className="card-title-main">
                                <span className="card-title-prefix">{challenge.title}</span>
                            </div>

                            {/* 내용 */}
                            <div className="challenge-details">
                                {challenge.content && <div className="card-title-content">{challenge.content}</div>}
                                {challenge.subtitle && <div className="card-subtitle">{challenge.subtitle}</div>}
                                <div className="challenge-frequency">
                                    <span
                                        className={
                                            challenge.frequency_type === 'daily'
                                                ? 'frequency-daily'
                                                : 'frequency-weekly'
                                        }
                                    >
                                        {challenge.frequency_type === 'daily'
                                            ? '매일'
                                            : `주 ${challenge.target_per_week}회`}
                                    </span>
                                </div>
                            </div>

                            {/* 하단 액션 */}
                            <div className="card-bottom-actions">
                                <div className="action-stats">
                                    <div
                                        className="stat-item"
                                        onClick={(e) => handleLikeClick(challenge.challenge_id, e)}
                                    >
                                        <FontAwesomeIcon icon={faThumbsUp} className="stat-icon-like" />
                                        <span>{challenge.likes}</span>
                                    </div>
                                    <div
                                        className="stat-item"
                                        onClick={(e) => handleCheerClick(challenge.challenge_id, e)}
                                    >
                                        <span role="img" aria-label="응원" className="stat-icon-cheer">
                                            🔥
                                        </span>
                                        <span>{challenge.cheers}</span>
                                    </div>
                                    <div
                                        className="stat-item"
                                        onClick={(e) => handleJoinClick(challenge.challenge_id)(e)}
                                    >
                                        <FontAwesomeIcon icon="user-group" className="stat-icon-group" />
                                        <span>{challenge.participants}</span>
                                    </div>
                                </div>
                                <button className="join-button" onClick={handleJoinClick(challenge.challenge_id)}>
                                    참여
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <BottomNav setTab={setTab} />
        </div>
    );
}
