import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp as solidThumb, faTrash } from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp as regularThumb } from "@fortawesome/free-regular-svg-icons";

export default function ChallengePosts({ posts, userId, handleReportPost, handleDeletePost, toggleCheer }) {
  if (posts.length === 0) return <p>아직 인증 글이 없습니다.</p>;

  return (
    <div className="posts-list">
      {posts.map((post) => (
        <div key={post.post_id} className="post-card">
          {userId && post.user_id === userId ? (
            <FontAwesomeIcon
              icon={faTrash}
              className="delete-icon"
              onClick={() => handleDeletePost(post.post_id)}
            />
          ) : (
            <button className="report-button" onClick={() => handleReportPost(post.post_id)}>
              🚨
            </button>
          )}

          <h4>{post.content?.title || ""}</h4>
          {post.content?.goals && (
            <ul>
              {post.content.goals.map((g, i) => (
                <li key={i}>{g}</li>
              ))}
            </ul>
          )}
          <p>{post.content?.summary}</p>
          <p>{post.content?.takeaways}</p>
          {post.content?.studyDurationText && (
            <p>
              학습시간: {post.content.studyDurationText} ({post.content.studyMinutes}분)
            </p>
          )}

          <span className="post-user">{post.username}</span>
          <span className="post-date">{new Date(post.created_at).toLocaleString()}</span>

          <div className="icon-wrapper">
            <FontAwesomeIcon
              icon={post.cheer_by_me ? solidThumb : regularThumb}
              onClick={() => toggleCheer(post.post_id, post.cheer_by_me)}
              className={`cheer-icon ${post.cheer_by_me ? "cheered" : ""}`}
            />
            <span className="cheer-count">{post.cheer_count}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
