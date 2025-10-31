import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../api/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faThumbsUp as solidThumbsUp, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import BottomNav from '../components/BottomNav';
import './Profile.css';

export default function OtherProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [nickname, setNickname] = useState('닉네임');
    const [createdChallenges, setCreatedChallenges] = useState([]);
    const [joinedChallenges, setJoinedChallenges] = useState([]);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = await fetchWithAuth(`http://127.0.0.1:3000/api/users/${id}`);
                if (userData?.user?.username) {
                    setNickname(userData.user.username);
                }

                const created = await fetchWithAuth(`http://127.0.0.1:3000/api/users/${id}/challenges?type=created`);
                const joined = await fetchWithAuth(`http://127.0.0.1:3000/api/users/${id}/challenges?type=joined`);

                if (created?.challengesList) setCreatedChallenges(created.challengesList);
                if (joined?.challengesList) setJoinedChallenges(joined.challengesList);
            } catch (err) {
                console.error('❌ 사용자 정보 요청 실패:', err);
                navigate('/home');
            }
        };

        loadUser();
    }, [id, navigate]);

    const handleChallengeClick = (challengeId) => {
        navigate(`/challenge/${challengeId}`);
    };

    return (
        <div className="profile-container">
            <div className="profile-content">
                <span className="profile-name">{nickname}</span>
                <FontAwesomeIcon icon={faUser} size="6x" className="profile-icon" />
            </div>

            <div className="challenge-section">
                <h3>{nickname}님이 만든 챌린지</h3>
                {createdChallenges.map((challenge) => (
                    <div
                        key={challenge.challenge_id}
                        className="challenge-card"
                        onClick={() => handleChallengeClick(challenge.challenge_id)}
                    >
                        <h4>{challenge.title}</h4>
                        <p>{challenge.content}</p>
                        <div className="challenge-icons">
                            <FontAwesomeIcon
                                icon={solidThumbsUp}
                                className={`like-icon ${challenge.liked_by_me ? 'liked' : ''}`}
                            />
                            <span className="like-count">{challenge.like_count}</span>
                            <FontAwesomeIcon
                                icon={faUserPlus}
                                className={`join-icon ${challenge.joined_by_me ? 'joined' : ''}`}
                            />
                            <span className="join-count">{challenge.participant_count}</span>
                        </div>
                    </div>
                ))}

                <h3>{nickname}님이 참여한 챌린지</h3>
                {joinedChallenges.map((challenge) => (
                    <div
                        key={challenge.challenge_id}
                        className="challenge-card"
                        onClick={() => handleChallengeClick(challenge.challenge_id)}
                    >
                        <h4>{challenge.title}</h4>
                        <p>{challenge.content}</p>
                        <div className="challenge-icons">
                            <FontAwesomeIcon
                                icon={solidThumbsUp}
                                className={`like-icon ${challenge.liked_by_me ? 'liked' : ''}`}
                            />
                            <span className="like-count">{challenge.like_count}</span>
                            <FontAwesomeIcon
                                icon={faUserPlus}
                                className={`join-icon ${challenge.joined_by_me ? 'joined' : ''}`}
                            />
                            <span className="join-count">{challenge.participant_count}</span>
                        </div>
                    </div>
                ))}
            </div>

            <BottomNav setTab={() => {}} />
        </div>
    );
}
