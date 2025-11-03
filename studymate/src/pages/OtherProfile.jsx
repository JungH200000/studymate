import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../api/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faThumbsUp as solidThumbsUp,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import BottomNav from "../components/BottomNav";
import "./Profile.css";

export default function OtherProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nickname, setNickname] = useState("닉네임");
  const [email, setEmail] = useState("");
  const [viewerId, setViewerId] = useState("");
  const [createdChallenges, setCreatedChallenges] = useState([]);
  const [joinedChallenges, setJoinedChallenges] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);

  // 타 사용자 정보 및 챌린지 목록 가져오기
  useEffect(() => {
    const loadViewer = async () => {
      try {
        const me = await fetchWithAuth("http://127.0.0.1:3000/api/me");
        if (me?.user?.user_id) {
          setViewerId(me.user.user_id);
        }
      } catch (err) {
        console.error("❌ 로그인 사용자 정보 요청 실패:", err);
      }
    };

    const loadUser = async () => {
      try {
        const data = await fetchWithAuth(`http://127.0.0.1:3000/api/users/${id}?viewer_id=${viewerId}`);
        console.log("data: ", data);
        if (data?.user?.username) {
          setNickname(data.user.username);
          setEmail(data.user.email || "");
          setIsFollowing(data.user.follow_by_me || false);
          setFollowerCount(data.user.follower_count || 0);
        }
      } catch (err) {
        console.error("❌ 사용자 정보 요청 실패:", err);
        navigate("/home");
      }
    };

    const loadChallenges = async () => {
      try {
        const created = await fetchWithAuth(
          `http://127.0.0.1:3000/api/users/${id}/challenges?type=created&viewer_id=${viewerId}`
        );
        const joined = await fetchWithAuth(
          `http://127.0.0.1:3000/api/users/${id}/challenges?type=joined&viewer_id=${viewerId}`
        );

        if (created?.challengesList) setCreatedChallenges(created.challengesList);
        if (joined?.challengesList) setJoinedChallenges(joined.challengesList);
      } catch (err) {
        console.error("❌ 챌린지 목록 요청 실패:", err);
      }
    };

    loadViewer();
    loadUser();
    loadChallenges();
  }, [viewerId, id, navigate]);

  const handleFollowToggle = async () => {
    try {
      const method = isFollowing ? "DELETE" : "POST";

      // 팔로우 또는 언팔로우 요청
      const followResponse = await fetchWithAuth(
        `http://127.0.0.1:3000/api/users/${id}/follows`,
        { method }
      );

      if (followResponse?.followResult) {
        const { follow_by_me, follower_count } = followResponse.followResult;
        setIsFollowing(follow_by_me);
        setFollowerCount(follower_count);
        console.log("팔로우 상태:", follow_by_me, "팔로워 수:", follower_count);
      } else {
        console.warn("팔로우 응답이 예상과 다릅니다:", followResponse);
      }
    } catch (err) {
      console.error("❌ 팔로우 요청 실패:", err);
    }
  };



  const handleChallengeClick = (challengeId) => {
    navigate(`/challenge/${challengeId}`);
  };

  return (
    <div>
      <div className="profile-content">
        <span className="profile-name">{nickname}</span>
        {email && <span className="profile-email">{email}</span>}
        <FontAwesomeIcon icon={faUser} size="6x" className="profile-icon" />
        <button className="follow-button" onClick={handleFollowToggle}>
          {isFollowing ? "언팔로우" : "팔로우"} ({followerCount})
        </button>
      </div>

      <div className="challenge-section">
        <h3>{nickname}님이 만든 챌린지</h3>
        {createdChallenges.length === 0 ? (
          <p>생성한 챌린지가 없습니다.</p>
        ) : (
          createdChallenges.map((challenge) => (
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
                  className={`like-icon ${challenge.liked_by_me ? "liked" : ""}`}
                />
                <span className="like-count">{challenge.like_count}</span>
                <FontAwesomeIcon
                  icon={faUserPlus}
                  className={`join-icon ${challenge.joined_by_me ? "joined" : ""}`}
                />
                <span className="join-count">{challenge.participant_count}</span>
              </div>
            </div>
          ))
        )}

        <h3>{nickname}님이 참여한 챌린지</h3>
        {joinedChallenges.length === 0 ? (
          <p>참여한 챌린지가 없습니다.</p>
        ) : (
          joinedChallenges.map((challenge) => (
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
                  className={`like-icon ${challenge.liked_by_me ? "liked" : ""}`}
                />
                <span className="like-count">{challenge.like_count}</span>
                <FontAwesomeIcon
                  icon={faUserPlus}
                  className={`join-icon ${challenge.joined_by_me ? "joined" : ""}`}
                />
                <span className="join-count">{challenge.participant_count}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <BottomNav setTab={() => {}} />
    </div>
  );
}
