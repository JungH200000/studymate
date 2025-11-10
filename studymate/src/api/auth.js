// src/api/auth.js
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from './config';

export const refreshAccessToken = async () => {
    try {
        const res = await axios.post(
            'http://192.168.123.178:3000',
            {},
            {
                withCredentials: true,
            }
        );

        const data = res.data;
        if (data.ok) {
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('user', JSON.stringify(data.user));
            return data.accessToken;
        } else {
            throw new Error(data.message || '토큰 재발급 실패');
        }
    } catch (err) {
        console.error('❌ 토큰 재발급 오류:', err);
        return null;
    }
};

export const fetchWithAuth = async (url, options = {}) => {
    if (!url || typeof url !== 'string') {
        throw new Error(`fetchWithAuth: 유효하지 않은 URL입니다 → ${url}`);
    }

    let token = localStorage.getItem('accessToken');
    const isAbsolute = /^https?:\/\//.test(url);
    const fullUrl = isAbsolute ? url : `${API_BASE}${url}`;

    try {
        const config = {
            url: fullUrl,
            method: options.method || 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                ...options.headers,
            },
            withCredentials: true,
        };

        if (options.body !== undefined && options.body !== null) {
            config.data = options.body;
        }

        const res = await axios(config);
        return res.data;
    } catch (err) {
        if (err.response?.status === 401) {
            token = await refreshAccessToken();
            if (!token) return null;

            try {
                const retryConfig = {
                    url: fullUrl,
                    method: options.method || 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        ...options.headers,
                    },
                    withCredentials: true,
                };

                if (options.body !== undefined && options.body !== null) {
                    retryConfig.data = options.body;
                }

                const retryRes = await axios(retryConfig);
                return retryRes.data;
            } catch (retryErr) {
                console.error('❌ 재시도 실패:', retryErr);
                return null;
            }
        } else {
            console.error('❌ 인증 요청 실패:', err);
             return err.response?.data || null;
        }
    }
};
