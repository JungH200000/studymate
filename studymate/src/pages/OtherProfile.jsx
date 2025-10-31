import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../api/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import BottomNav from "../components/BottomNav";

export default function OtherProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("닉네임");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("user"));

    const loadUser = async () => {
      try {

        let data = await fetchWithAuth(`http://127.0.0.1:3000/api/users/${id}`);

        if (data?.user?.username) {
          setNickname(data.user.username);
        }
      } catch (err) {
        console.error("❌ 사용자 정보 요청 실패:", err);
        navigate("/home");
      }
    };

    loadUser();
  }, [id, navigate]);

  return (
    <div>
      <div className="profile-content">
        <span className="profile-name">{nickname}</span>
        {email && <span className="profile-email">{email}</span>}
        <FontAwesomeIcon icon={faUser} size="6x" className="profile-icon" />
      </div>

      <BottomNav setTab={() => {}} />
    </div>
  );
}
