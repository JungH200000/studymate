import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../api/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import BottomNav from "../components/BottomNav";
import ChallengeInfo from "../components/ChallengeInfo";
import PostForm from "../components/PostForm";
import PostLists from "../components/PostLists";
import "./ChallengeDetail.css";

const API_BASE = "http://127.0.0.1:3000/api";

export default function ChallengeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [challenge, setChallenge] = useState(null);
  const [likes, setLikes] = useState({ liked: false, count: 0 });
  const [participants, setParticipants] = useState({ joined: false, count: 0 });
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [tab, setTab] = useState("detail");

  const [formData, setFormData] = useState({
    title: "",
    goalsText: "",
    summary: "",
    takeaways: "",
    textbookName: "",
    textbookPageStart: "",
    textbookPageEnd: "",
    lectureTeacher: "",
    lectureSeries: "",
    lectureStart: "",
    lectureEnd: "",
    linkInput: "",
    links: [],
    studyHours: "",
    studyMinutesInput: "",
    nextStepsText: "",
    tagsText: "",
  });

  const formatDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (storedUser.user_id) setUserId(storedUser.user_id);

    const loadChallenge = async () => {
      setIsLoading(true);
      try {
        const res = await fetchWithAuth(`${API_BASE}/challenges`);
        const found = res.challengesList?.find((c) => c.challenge_id === id);
        if (found) {
          setChallenge(found);
          setLikes({
            liked: !!found.liked_by_me,
            count: found.like_count || 0,
          });
          setParticipants({
            joined: !!found.joined_by_me,
            count: found.participant_count || 0,
          });
        }
      } catch (err) {
        console.error("챌린지 로딩 실패:", err);
      } finally {
        setIsLoading(false);
      }
    };

    const loadPosts = async () => {
      try {
        const res = await fetchWithAuth(`${API_BASE}/challenges/${id}/posts`);
        
        if (res.ok && Array.isArray(res.postsList)) {
          setPosts(res.postsList);
        } else {
          console.warn("인증글 배열이 없습니다:", res);
        }
      } catch (err) {
        console.error("인증글 로딩 실패:", err);
      }
    };

    loadChallenge();
    loadPosts();
  }, [id]);

  const convertToMinutes = (hours, minutes) => {
    const h = parseInt(hours || "0", 10) || 0;
    const m = parseInt(minutes || "0", 10) || 0;
    return h * 60 + m;
  };

  const buildContentPayload = () => {
    const content = {};

    if (formData.title?.trim()) content.title = formData.title.trim();

    const goals = (formData.goalsText || "")
      .split(",")
      .map((g) => g.trim())
      .filter(Boolean);
    if (goals.length) content.goals = goals;

    if (formData.summary?.trim()) content.summary = formData.summary.trim();
    if (formData.takeaways?.trim()) content.takeaways = formData.takeaways.trim();

    const materials = {};
    const tName = formData.textbookName?.trim();
    const pStart = formData.textbookPageStart?.trim();
    const pEnd = formData.textbookPageEnd?.trim();
    if (tName || pStart || pEnd) {
      const textbook = {};
      if (tName) textbook.name = tName;
      if (pStart) textbook.pageStart = Number(pStart);
      if (pEnd) textbook.pageEnd = Number(pEnd);
      materials.textbook = textbook;
    }

    const lecTeacher = formData.lectureTeacher?.trim();
    const lecSeries = formData.lectureSeries?.trim();
    const lecStart = formData.lectureStart?.trim();
    const lecEnd = formData.lectureEnd?.trim();
    if (lecTeacher || lecSeries || lecStart || lecEnd) {
      const lecture = {};
      if (lecTeacher) lecture.teacher = lecTeacher;
      if (lecSeries) lecture.series = lecSeries;
      if (lecStart) lecture.lessonStart = Number(lecStart);
      if (lecEnd) lecture.lessonEnd = Number(lecEnd);
      materials.lecture = lecture;
    }

    if (formData.links && formData.links.length) {
      materials.links = formData.links.filter(Boolean);
    }

    if (Object.keys(materials).length) content.materials = materials;

    const studyHours = formData.studyHours?.trim();
    const studyMins = formData.studyMinutesInput?.trim();
    if (studyHours || studyMins) {
      const durationTextParts = [];
      if (studyHours) durationTextParts.push(`${studyHours}시간`);
      if (studyMins) durationTextParts.push(`${studyMins}분`);
      content.studyDurationText = durationTextParts.join(" ");
      content.studyMinutes = convertToMinutes(studyHours, studyMins);
    }

    const nextSteps = (formData.nextStepsText || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (nextSteps.length) content.nextSteps = nextSteps;

    const tags = (formData.tagsText || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (tags.length) content.tags = tags;

    return content;
  };

  const toggleLike = async () => {
    if (!userId) return alert("로그인이 필요합니다.");
    const method = likes.liked ? "DELETE" : "POST";

    try {
      const res = await fetchWithAuth(`${API_BASE}/challenges/${id}/likes`, { method });

      if (res?.ok) {
        const { liked_by_me, like_count, created, deleted } = res;
        setLikes({
          liked: liked_by_me,
          count: parseInt(like_count, 10),
        });

        if (created === false || deleted === false) {
          alert("이미 처리된 요청입니다.");
        }
      } else {
        alert("좋아요 실패: " + (res?.message || "알 수 없는 오류"));
      }
    } catch (err) {
      console.error("좋아요 실패:", err);
      alert("좋아요 중 오류가 발생했습니다.");
    }
  };

  const toggleParticipation = async () => {
    if (!userId) return alert("로그인이 필요합니다.");
    const method = participants.joined ? "DELETE" : "POST";

    try {
      const res = await fetchWithAuth(`${API_BASE}/challenges/${id}/participants`, { method });

      if (res?.ok) {
        const { joined_by_me, participant_count, created, deleted } = res;
        setParticipants({
          joined: joined_by_me,
          count: parseInt(participant_count, 10),
        });

        if (created === false || deleted === false) {
          alert("이미 처리된 요청입니다.");
        }
      } else {
        alert("참가 실패: " + (res?.message || "알 수 없는 오류"));
      }
    } catch (err) {
      console.error("참가 실패:", err);
      alert("참가 중 오류가 발생했습니다.");
    }
  };

  const toggleCheer = async (postId, cheerByMe) => {
    const method = cheerByMe ? "DELETE" : "POST";

    try {
      const data = await fetchWithAuth(`${API_BASE}/challenges/posts/${postId}/cheers`, { method });

      if (!data || typeof data.cheer_by_me !== "boolean") {
        alert(data?.message || "응원 요청에 실패했습니다.");
        return;
      }

      setPosts((prev) =>
        prev.map((p) =>
          p.post_id === postId
            ? {
                ...p,
                cheer_by_me: data.cheer_by_me,
                cheer_count: data.cheer_count,
              }
            : p
        )
      );
      if (data.created === false) {
        alert("이미 처리된 요청입니다.");
      }
    } catch (err) {
      console.error("응원 처리 실패:", err);
      alert("응원 중 오류가 발생했습니다.");
    }
  };

  const handleReportChallenge = async (challengeId) => {
    const reason = prompt("챌린지를 신고하는 이유를 입력해주세요 (5~500자)");
    if (!reason || reason.trim().length < 5 || reason.trim().length > 500) {
      return alert("신고 사유는 5~500자여야 합니다.");
    }
    
    try {
      const res = await fetchWithAuth(`${API_BASE}/reports/challenges/${challengeId}`, {
        method: "POST",
        body: JSON.stringify({ content: reason.trim() }),
      });

      if (res.ok) {
        alert("챌린지가 신고되었습니다.");
      } else {
        switch (res.code) {
          case "ERR_ALREADY_REPORTED":
            alert("이미 신고한 챌린지입니다.");
            break;
          case "INVALID_REPORT_INPUT":
            alert("신고 사유는 5~500자여야 합니다.");
            break;
          default:
            alert(res.message || "신고 처리 중 오류가 발생했습니다.");
        }
      }
    } catch (err) {
      console.error("챌린지 신고 실패:", err);
      alert("신고 요청 중 오류가 발생했습니다.");
    }
  };

  const handleReportPost = async (postId) => {
    const reason = prompt("인증글을 신고하는 이유를 입력해주세요 (5~500자)");
    if (!reason || reason.trim().length < 5 || reason.trim().length > 500) {
      return alert("신고 사유는 5~500자여야 합니다.");
    }

    try {
      const res = await fetchWithAuth(`${API_BASE}/reports/posts/${postId}`, {
        method: "POST",
        body: JSON.stringify({ content: reason.trim() }),
      });

      if (res.ok) {
        alert("인증글이 신고되었습니다.");
      } else {
        switch (res.code) {
          case "ERR_ALREADY_REPORTED":
            alert("이미 신고한 인증글입니다.");
            break;
          case "INVALID_REPORT_INPUT":
            alert("신고 사유는 5~500자여야 합니다.");
            break;
          default:
            alert(res.message || "신고 처리 중 오류가 발생했습니다.");
        }
      }
    } catch (err) {
      console.error("인증글 신고 실패:", err);
      alert("신고 요청 중 오류가 발생했습니다.");
    }
  };

  const handleAddLink = () => {
    const v = formData.linkInput?.trim();
    if (!v) return;
    setFormData((prev) => ({ ...prev, links: [...(prev.links || []), v], linkInput: "" }));
  };

  const handleRemoveLink = (index) => {
    setFormData((prev) => ({ ...prev, links: prev.links.filter((_, i) => i !== index) }));
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();

    const content = buildContentPayload();
    if (!Object.keys(content).length) {
      return alert("content를 하나 이상 입력해주세요.");
    }

    try {
      const payload = {
        content,
        user_id: userId,
        challenge_id: id,
      };

      const res = await fetchWithAuth(`${API_BASE}/challenges/${id}/posts`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (res.ok && res.post) {
        setPosts((prev) => [res.post, ...prev]);

        setChallenge((prev) => ({
          ...prev,
          post_count: res.post_count,
        }));

        setFormData({
          title: "",
          goalsText: "",
          summary: "",
          takeaways: "",
          textbookName: "",
          textbookPageStart: "",
          textbookPageEnd: "",
          lectureTeacher: "",
          lectureSeries: "",
          lectureStart: "",
          lectureEnd: "",
          linkInput: "",
          links: [],
          studyHours: "",
          studyMinutesInput: "",
          nextStepsText: "",
          tagsText: "",
        });

        const remaining = Math.max(res.getWeeklyTarget - res.myWeekPostCount, 0);

        if (remaining === 0) {
          alert(
            `인증글이 등록되었습니다!\n
            내 인증글 수: ${res.myPostCount}\n
            이번 주 인증글 수: ${res.myWeekPostCount}\n
            주간 목표: ${res.getWeeklyTarget}\n
            이번 주 목표를 모두 달성했어요! 멋져요 👏`
          );
        } else {
          alert(
            `인증글이 등록되었습니다.\n
            내 인증글 수: ${res.myPostCount}\n
            이번 주 인증글 수: ${res.myWeekPostCount}\n
            주간 목표: ${res.getWeeklyTarget}\n
            이번 주에 ${remaining}번 더 인증글을 작성하면 목표를 달성할 수 있어요!`
          );
        }
      } else {
        alert(res.message || "작성 실패");
      }
    } catch (err) {
      console.error("작성 실패:", err);
      alert("인증글 작성 중 오류가 발생했습니다.");
    }
  };


  if (isLoading)
    return (
      <div className="loading-spinner">
        <FontAwesomeIcon icon={faSpinner} spin />
      </div>
    );

  if (!challenge) return <div>챌린지를 찾을 수 없습니다.</div>;

  return (
  <div className="challenge-detail-container">
    <header className="write-header">
      <span className="cancel-btn" onClick={() => navigate("/home")}>
        ❌
      </span>
    </header>

    <div className="detail-content">
      <ChallengeInfo
        challenge={challenge}
        likes={likes}
        participants={participants}
        userId={userId}
        toggleLike={toggleLike}
        toggleParticipation={toggleParticipation}
        handleReportChallenge={handleReportChallenge}
        //handleDelete={handleDelete}
        formatDate={formatDate}
      />

      {participants.joined && (
        <PostForm
          formData={formData}
          setFormData={setFormData}
          handleAddLink={handleAddLink}
          handleRemoveLink={handleRemoveLink}
          handlePostSubmit={handlePostSubmit}
        />
      )}

      <PostLists
        posts={posts}
        userId={userId}
        handleReportPost={handleReportPost}
        //handleDeletePost={handleDeletePost}
        toggleCheer={toggleCheer}
      />
    </div>

    <BottomNav setTab={setTab} />
  </div>
);
}