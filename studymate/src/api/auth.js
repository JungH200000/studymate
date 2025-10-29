// src/api/auth.js
import axios from "axios";

export const refreshAccessToken = async () => {
  try {
    const res = await axios.post("http://127.0.0.1:3000/api/auth/refresh", {}, {
      withCredentials: true, // refreshToken 쿠키 자동 전송
    });

    const data = res.data;
    if (data.ok && data.accessToken) {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      return data.accessToken;
    } else {
      throw new Error(data.message || "토큰 재발급 실패");
    }
  } catch (err) {
    console.error("❌ 토큰 재발급 오류:", err.response?.data?.message || err.message);
    return null;
  }
};

export const fetchWithAuth = async (url, options = {}) => {
  let token = localStorage.getItem("accessToken");

  const buildConfig = (token) => {
    const config = {
      url,
      method: options.method || "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
      withCredentials: true,
    };

    if (options.body !== undefined && options.body !== null) {
      config.data = options.body;
    }

    return config;
  };

  try {
    const res = await axios(buildConfig(token));
    return res.data;
  } catch (err) {
    if (err.response?.status === 401) {
      // accessToken 만료 → refresh 시도
      const newToken = await refreshAccessToken();
      if (!newToken) {
        alert("세션이 만료되었습니다. 다시 로그인해주세요.");
        window.location.href = "/login";
        return null;
      }

      try {
        const retryRes = await axios(buildConfig(newToken));
        return retryRes.data;
      } catch (retryErr) {
        console.error("❌ 재시도 실패:", retryErr.response?.data?.message || retryErr.message);
        alert("인증 재시도 중 오류가 발생했습니다.");
        window.location.href = "/login";
        return null;
      }
    } else {
      console.error("❌ 인증 요청 실패:", err.response?.data?.message || err.message);
      return null;
    }
  }
};

