import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    Title,
} from 'chart.js';
import './AchievementChart.css';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

export default function AchievementChart({ totalRate = 0, day30Rate = 0 }) {
    // 안전하게 처리
    const safeRate = (rate) => (typeof rate === 'number' && !isNaN(rate) ? rate : 0);

    // 백분율 계산
    const totalRatePercent = Math.round(safeRate(totalRate) * 100);
    const totalRemaining = 100 - totalRatePercent;

    const day30RatePercent = Math.round(safeRate(day30Rate) * 100);
    const day30Remaining = 100 - day30RatePercent;

    // 전체 달성률 데이터
    const totalData = {
        labels: ['달성률', '미달성률'],
        datasets: [
            {
                data: [totalRatePercent, totalRemaining],
                backgroundColor: ['#4CAF50', '#BDBDBD'],
                borderWidth: 1,
            },
        ],
    };

    // 최근 30일 달성률 데이터
    const day30Data = {
        labels: ['달성률', '미달성률'],
        datasets: [
            {
                data: [day30RatePercent, day30Remaining],
                backgroundColor: ['#2196F3', '#BDBDBD'],
                borderWidth: 1,
            },
        ],
    };

    // 공통 옵션
    const options = (title) => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom' },
            title: {
                display: true,
                text: title,
                font: { size: 16 },
            },
        },
    });

    return (
        <div className="achievement-chart-container">
            <div className="chart-block">
                <Pie data={totalData} options={options('전체 챌린지 누적 달성률')} />
            </div>
            <div className="chart-block">
                <Pie data={day30Data} options={options('최근 30일 챌린지 달성률')} />
            </div>
        </div>
    );
}
