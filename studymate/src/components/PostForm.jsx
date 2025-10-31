import React from "react";

export default function ChallengeForm({
  formData,
  setFormData,
  handleAddLink,
  handleRemoveLink,
  handlePostSubmit,
}) {
  return (
    <form className="post-form-card" onSubmit={handlePostSubmit}>
      <input
        type="text"
        placeholder="제목"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />

      <input
        type="text"
        placeholder="학습 목표 (쉼표로 구분)"
        value={formData.goalsText}
        onChange={(e) => setFormData({ ...formData, goalsText: e.target.value })}
      />

      <textarea
        placeholder="학습 요약"
        value={formData.summary}
        onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
      />

      <textarea
        placeholder="오늘 배운 점 / 느낀 점"
        value={formData.takeaways}
        onChange={(e) => setFormData({ ...formData, takeaways: e.target.value })}
      />

      <fieldset className="reference-section">
        <legend>참고 자료 (선택)</legend>
        <input
          type="text"
          placeholder="문제집 이름"
          value={formData.textbookName}
          onChange={(e) => setFormData({ ...formData, textbookName: e.target.value })}
        />
        <div className="horizontal-group">
          <input
            type="number"
            placeholder="시작 페이지"
            value={formData.textbookPageStart}
            onChange={(e) => setFormData({ ...formData, textbookPageStart: e.target.value })}
          />
          <input
            type="number"
            placeholder="종료 페이지"
            value={formData.textbookPageEnd}
            onChange={(e) => setFormData({ ...formData, textbookPageEnd: e.target.value })}
          />
        </div>

        <hr className="section-divider" />

        <input
          type="text"
          placeholder="강사 이름"
          value={formData.lectureTeacher}
          onChange={(e) => setFormData({ ...formData, lectureTeacher: e.target.value })}
        />
        <input
          type="text"
          placeholder="강의 시리즈"
          value={formData.lectureSeries}
          onChange={(e) => setFormData({ ...formData, lectureSeries: e.target.value })}
        />
        <div className="horizontal-group">
          <input
            type="number"
            placeholder="강의 시작 번호"
            value={formData.lectureStart}
            onChange={(e) => setFormData({ ...formData, lectureStart: e.target.value })}
          />
          <input
            type="number"
            placeholder="강의 종료 번호"
            value={formData.lectureEnd}
            onChange={(e) => setFormData({ ...formData, lectureEnd: e.target.value })}
          />
        </div>

        <hr className="section-divider" />

        <div className="link-input-group">
          <input
            type="text"
            placeholder="링크 입력 후 추가"
            value={formData.linkInput}
            onChange={(e) => setFormData({ ...formData, linkInput: e.target.value })}
          />
          <button type="button" onClick={handleAddLink} className="add-button">
            추가
          </button>
        </div>

        <div className="link-list">
          {formData.links?.map((lnk, i) => (
            <div key={i} className="link-item">
              <a href={lnk} target="_blank" rel="noreferrer" className="link-url">
                {lnk}
              </a>
              <button type="button" onClick={() => handleRemoveLink(i)} className="remove-button">
                삭제
              </button>
            </div>
          ))}
        </div>
      </fieldset>

      <div className="horizontal-group">
        <input
          type="number"
          min="0"
          placeholder="시간(정수)"
          value={formData.studyHours}
          onChange={(e) => setFormData({ ...formData, studyHours: e.target.value })}
        />
        <input
          type="number"
          min="0"
          placeholder="분(정수)"
          value={formData.studyMinutesInput}
          onChange={(e) => setFormData({ ...formData, studyMinutesInput: e.target.value })}
        />
      </div>

      <input
        type="text"
        placeholder="다음 학습(쉼표로 구분)"
        value={formData.nextStepsText}
        onChange={(e) => setFormData({ ...formData, nextStepsText: e.target.value })}
      />

      <input
        type="text"
        placeholder="태그 (쉼표로 구분)"
        value={formData.tagsText}
        onChange={(e) => setFormData({ ...formData, tagsText: e.target.value })}
      />

      <button type="submit">작성</button>
    </form>
  );
}
