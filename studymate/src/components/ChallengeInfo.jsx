import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp as solidThumb,
  faUserPlus,
  faUserCheck,
  faFileAlt,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp as regularThumb } from "@fortawesome/free-regular-svg-icons";

export default function ChallengeInfo({
  challenge,
  likes,
  participants,
  userId,
  toggleLike,
  toggleParticipation,
  handleReportChallenge,
  handleDelete,
  formatDate,
}) {
  return (
    <div className="challenge-header">
      {userId && challenge.creator_id === userId ? (
        <FontAwesomeIcon
          icon={faTrash}
          className="delete-icon"
          onClick={(e) => handleDelete(challenge.challenge_id, e)}
        />
      ) : (
        <button
          className="report-button"
          onClick={(e) => handleReportChallenge(challenge.challenge_id, e)}
        >
          🚨
        </button>
      )}

      <h1>{challenge.title}</h1>
      <p>{challenge.content}</p>
      <p>작성자: {challenge.author_username}</p>
      <p>
        빈도: {challenge.frequency_type === "daily" ? "일일" : `주 ${challenge.target_per_week}회`}
      </p>
      <p>
        기간: {formatDate(challenge.start_date)}
        {challenge.end_date ? ` ~ ${formatDate(challenge.end_date)}` : ""}
      </p>

      <div className="icon-section">
        <div className="icon-wrapper">
          <FontAwesomeIcon
            icon={likes.liked ? solidThumb : regularThumb}
            onClick={toggleLike}
            className={`like-icon ${likes.liked ? "liked" : ""}`}
          />
          <span className="like-count">{likes.count}</span>
        </div>

        <div className="icon-wrapper">
          <FontAwesomeIcon
            icon={participants.joined ? faUserCheck : faUserPlus}
            onClick={toggleParticipation}
            className={`join-icon ${participants.joined ? "joined" : ""}`}
          />
          <span className="join-count">{participants.count}</span>
        </div>

        <div className="icon-wrapper">
          <FontAwesomeIcon icon={faFileAlt} className="stat-icon" />
          <span className="stat-count">{challenge.post_count}</span>
        </div>
      </div>
    </div>
  );
}
