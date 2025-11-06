import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import './AchievementChart.css';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

export default function AchievementChart({ totalRate = 0, day30Rate = 0, posts = [], userId }) {
    const safeRate = (rate) => (typeof rate === 'number' && !isNaN(rate) ? rate : 0);

    const totalRatePercent = Math.round(safeRate(totalRate) * 100);
    const totalRemaining = 100 - totalRatePercent;

    const day30RatePercent = Math.round(safeRate(day30Rate) * 100);
    const day30Remaining = 100 - day30RatePercent;

    const totalData = {
        labels: ['달성률', '미달성률'],
        datasets: [
            {
                data: [totalRatePercent, totalRemaining],
                backgroundColor: ['#4CAF50', '#FFDAB9'],
                borderWidth: 1,
            },
        ],
    };

    const day30Data = {
        labels: ['달성률', '미달성률'],
        datasets: [
            {
                data: [day30RatePercent, day30Remaining],
                backgroundColor: ['#2196F3', '#E0F7F4'],
                borderWidth: 1,
            },
        ],
    };

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

    // 잔디형 캘린더 데이터 생성
    const today = new Date();
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(today.getDate() - 90);

    const heatmapValues = posts
        .filter((post) => post.user_id === userId)
        .map((post) => {
            const date = new Date(post.created_at).toISOString().split('T')[0];
            return { date, count: 1 };
        })
        .reduce((acc, curr) => {
            const existing = acc.find((item) => item.date === curr.date);
            if (existing) {
                existing.count += 1;
            } else {
                acc.push({ date: curr.date, count: 1 });
            }
            return acc;
        }, []);

    // 최대 인증 횟수 기준으로 색상 강도 조절
    const maxCount = Math.max(...heatmapValues.map((v) => v.count), 1);

    const getColorClass = (value) => {
        if (!value || !value.count) return 'color-empty';
        const ratio = value.count / maxCount;

        if (ratio > 0.8) return 'color-scale-4';
        if (ratio > 0.6) return 'color-scale-3';
        if (ratio > 0.4) return 'color-scale-2';
        if (ratio > 0.2) return 'color-scale-1';
        return 'color-scale-0';
    };

    return (
        <div className="achievement-chart-container">
            <div className="chart-block">
                <Pie data={totalData} options={options('전체 챌린지 누적 달성률')} />
            </div>
            <div className="chart-block">
                <Pie data={day30Data} options={options('최근 30일 챌린지 달성률')} />
            </div>
            <div className="chart-block">
                <h3>최근 90일 인증 활동</h3>
                <CalendarHeatmap
                    startDate={ninetyDaysAgo}
                    endDate={today}
                    values={heatmapValues}
                    classForValue={getColorClass}
                    showWeekdayLabels
                />
            </div>
        </div>
    );
}
