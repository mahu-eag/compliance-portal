import React from 'react';

export default function Question({ question, value, onChange }) {
  return (
    <div className="question-card">
      <div className="question-header">
        <span className="question-category">{question.category}</span>
        <h2 className="question-text">{question.text}</h2>
        {question.description && (
          <p className="question-description">{question.description}</p>
        )}
      </div>

      <div className="options-list" role="radiogroup">
        {question.options.map((option) => {
          const isChecked = value === option.value;
          return (
            <label
              key={option.value}
              className={`option-item ${isChecked ? 'option-checked' : ''}`}
            >
              <input
                type="radio"
                name={question.id}
                value={option.value}
                checked={isChecked}
                onChange={() => onChange(question.id, option.value)}
              />
              <span className="option-checkbox" aria-hidden="true">
                {isChecked && <span className="checkmark">✓</span>}
              </span>
              <span className="option-label">{option.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}