import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import CalendarHeatmap from 'react-calendar-heatmap';
import './AchievementChart.css';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

export default function AchievementChart({ totalRate = 0, day30Rate = 0, posts = [], userId }) {
    // 안전하게 처리
    const safeRate = (rate) => (typeof rate === 'number' && !isNaN(rate) ? rate : 0);

    // 백분율 계산 (0~1 사이의 값)
    // Math.round(rate * 100)을 사용하면 0~100 사이의 정수 백분율이 나옴
    const totalRatePercent = Math.round(safeRate(totalRate) * 100);
    const totalRemaining = 100 - totalRatePercent;

    const day30RatePercent = Math.round(safeRate(day30Rate) * 100);
    const day30Remaining = 100 - day30RatePercent;

    // 전체 달성률 데이터 (앱 테마 색상으로 통일)
    const totalData = {
        labels: ['달성률', '미달성률'],
        datasets: [
            {
                data: [totalRatePercent, totalRemaining],
                // ✅ 색상 수정: 핑크 계열로 통일
                backgroundColor: ['#FF6B7A', '#FEEAEA'], // 달성률(강조색), 미달성률(연한 배경색)
                borderWidth: 1,
            },
        ],
    };

    // 최근 30일 달성률 데이터 (앱 테마 색상으로 통일)
    const day30Data = {
        labels: ['달성률', '미달성률'],
        datasets: [
            {
                data: [day30RatePercent, day30Remaining],
                // ✅ 색상 수정: 핑크 계열로 통일
                backgroundColor: ['#E91E63', '#FCE4EC'], // 달성률(진한 강조색), 미달성률(매우 연한 배경색)
                borderWidth: 1,
            },
        ],
    };

    // 공통 옵션
    const options = (title) => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    font: {
                        size: 16, // ✅ 범례 글꼴 크기
                    },
                },
            },
            title: {
                display: true,
                text: title,
                font: { size: 18 },
            },
            // 파이 차트의 중앙 비율을 표시하기 위해 툴팁을 비활성화할 수도 있습니다.
            tooltip: {
                enabled: true,
            },
        },
    });

    // 잔디형 캘린더 데이터 생성
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 90);

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

        const count = value.count;

        if (count >= 5) return 'color-scale-5';
        if (count === 4) return 'color-scale-4';
        if (count === 3) return 'color-scale-3';
        if (count === 2) return 'color-scale-2';
        if (count === 1) return 'color-scale-1';
        return 'color-empty'; // 0회
    };

    return (
        <div className="achievement-chart-container">
            {/* 최근 인증 활동 */}
            <div className="chart-block calendar-block">
                <h3>최근 인증 활동</h3>
                <CalendarHeatmap
                    startDate={thirtyDaysAgo}
                    endDate={today}
                    values={heatmapValues}
                    classForValue={getColorClass}
                    showWeekdayLabels
                />
                <div className="heatmap-legend">
                    <div className="legend-scale">
                        <span>less</span>
                        <span className="color-box color-empty"></span>
                        <span className="color-box color-scale-1"></span>
                        <span className="color-box color-scale-2"></span>
                        <span className="color-box color-scale-3"></span>
                        <span className="color-box color-scale-4"></span>
                        <span>more</span>
                    </div>
                </div>
            </div>

            {/* 최근 30일 달성률 차트 */}
            <div className="chart-block pie-block">
                <Pie data={day30Data} options={options('최근 30일 챌린지 달성률')} />
            </div>

            {/* 전체 누적 달성률 차트 */}
            <div className="chart-block pie-block">
                <Pie data={totalData} options={options('전체 챌린지 누적 달성률')} />
            </div>
        </div>
    );
}