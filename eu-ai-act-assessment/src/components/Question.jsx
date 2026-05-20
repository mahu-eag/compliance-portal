import React from 'react';

export default function Question({ question, answer, onChange }) {
  const isMulti = question.type === 'multi';

  const handleSingle = (val) => onChange(question.id, val);

  const handleMulti = (val) => {
    const current = Array.isArray(answer) ? answer : [];
    // Toggle "none" options exclusively
    const isNoneOpt = question.options.find((o) => o.value === val)?.value.startsWith('none');
    if (isNoneOpt) {
      onChange(question.id, current.includes(val) ? [] : [val]);
      return;
    }
    // Remove any "none" option when selecting real options
    const withoutNone = current.filter((v) => !v.startsWith('none'));
    const next = withoutNone.includes(val)
      ? withoutNone.filter((v) => v !== val)
      : [...withoutNone, val];
    onChange(question.id, next);
  };

  const isChecked = (val) => {
    if (isMulti) return Array.isArray(answer) && answer.includes(val);
    return answer === val;
  };

  return (
    <div className="question-card">
      <span className="question-category">{question.category}</span>
      <p className="question-text">{question.text}</p>
      {question.description && (
        <p className="question-description">{question.description}</p>
      )}
      {isMulti && (
        <p style={{ fontSize: '0.8rem', color: 'var(--elpix-gray)', marginBottom: '1rem', marginTop: '-0.5rem' }}>
          Mehrfachauswahl möglich
        </p>
      )}
      <div className="options-list">
        {question.options.map((opt) => {
          const checked = isChecked(opt.value);
          return (
            <div
              key={opt.value}
              className={`option-item${checked ? ' option-checked' : ''}`}
              onClick={() => (isMulti ? handleMulti(opt.value) : handleSingle(opt.value))}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  isMulti ? handleMulti(opt.value) : handleSingle(opt.value);
                }
              }}
            >
              <div className="option-checkbox">
                {checked && <span className="checkmark">✓</span>}
              </div>
              <span className="option-label">{opt.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
