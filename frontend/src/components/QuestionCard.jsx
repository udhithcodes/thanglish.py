import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCodePlayground } from '../context/CodePlaygroundContext';
import {
  Bookmark, CheckCircle2, XCircle, Lightbulb, SplitSquareVertical,
  ArrowRight, RotateCcw, Terminal, Check
} from 'lucide-react';

export default function QuestionCard({
  question,
  onAnswerSubmit,
  onBookmarkToggle,
  onNext,
  showNextButton = true,
  mode = 'learning', // 'learning' or 'test'
  submittedAnswer = null,
  feedback = null,
}) {
  const { language, setLanguage, compareMode, toggleCompareMode, languages } = useLanguage();
  const { openPlayground } = useCodePlayground();
  const [selectedOption, setSelectedOption] = useState(submittedAnswer?.selectedOption || '');
  const [codeAnswer, setCodeAnswer] = useState(submittedAnswer?.codeAnswer || '');
  const [showHint, setShowHint] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(question?.is_bookmarked || false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper to get translated question based on current language
  const getQuestionText = (lang) => {
    if (lang === 'english') {
      return question.english_question;
    }
    const tr = question.translations?.[lang];
    if (tr && tr.translated_question) {
      return tr.translated_question;
    }
    return question.english_question;
  };

  const currentQuestionText = getQuestionText(language);
  const englishQuestionText = question.english_question;

  const handleOptionClick = (key) => {
    if (feedback) return; // already answered
    setSelectedOption(key);
  };

  const handleSubmit = async () => {
    if (!selectedOption && !codeAnswer) return;
    setIsSubmitting(true);
    try {
      await onAnswerSubmit({
        question_id: question.id,
        selected_option: selectedOption,
        code_answer: codeAnswer,
        mode,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBookmark = async () => {
    const newState = !isBookmarked;
    setIsBookmarked(newState);
    if (onBookmarkToggle) {
      await onBookmarkToggle(question.id);
    }
  };

  const handleOpenEditor = () => {
    const sampleCode = question.code_snippet 
      ? question.code_snippet 
      : `# Test Python code for: ${question.title}\n# Write your code or experiment below\n`;
    openPlayground({
      code: sampleCode,
      title: question.title,
      context: question.topic_name || 'Practice Question'
    });
  };

  return (
    <div className="card" style={{
      position: 'relative',
      backgroundColor: 'var(--bg-surface)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-xl)',
      padding: '2rem',
      boxShadow: 'var(--shadow-md)',
      transition: 'all var(--transition-normal)'
    }}>
      {/* Header: Topic, Question ID/Type, Bookmark, Compare Toggle, Language Switcher */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.85rem',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span className="badge badge-accent" style={{ fontWeight: 700 }}>
            Question #{question.id}
          </span>
          {question.topic_name && (
            <span className="badge" style={{ backgroundColor: 'var(--bg-muted)', color: 'var(--text-forest)' }}>
              {question.topic_name}
            </span>
          )}
          <span className="badge" style={{ backgroundColor: 'var(--bg-muted)', textTransform: 'capitalize' }}>
            {question.question_type ? question.question_type.replace('_', ' ') : 'Concept'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* Comparison Mode Toggle */}
          <button
            onClick={toggleCompareMode}
            className={`btn btn-sm ${compareMode ? 'btn-primary' : 'btn-outline'}`}
            style={{ borderRadius: 'var(--radius-full)', fontSize: '0.78rem', padding: '0.3rem 0.75rem' }}
            title="Toggle side-by-side English comparison"
          >
            <SplitSquareVertical size={14} />
            <span>{compareMode ? 'Comparing' : 'Compare English'}</span>
          </button>

          {/* Inline Language Segmented Control */}
          <div className="lang-switcher">
            {languages.map(l => (
              <button
                key={l.id}
                onClick={() => setLanguage(l.id)}
                className={`lang-btn ${language === l.id ? 'active' : ''}`}
                style={{ fontSize: l.id === 'ta' ? '0.85rem' : '0.8rem', padding: '0.25rem 0.65rem' }}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Bookmark Button */}
          <button
            onClick={handleBookmark}
            className="btn btn-secondary btn-sm"
            style={{
              borderRadius: 'var(--radius-full)',
              width: '34px',
              height: '34px',
              padding: 0,
              color: isBookmarked ? 'var(--text-forest)' : 'var(--text-olive)'
            }}
            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Question'}
          >
            <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      {/* Question Title & Translation Info */}
      <h3 style={{
        fontSize: '1.25rem',
        fontWeight: 700,
        color: 'var(--text-primary)',
        marginBottom: '1rem',
        lineHeight: 1.4
      }}>
        {question.title}
      </h3>

      {/* Main Question Display: Dual Comparison Mode or Single View */}
      {compareMode && language !== 'english' ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          {/* Left Card: ENGLISH (ORIGINAL) */}
          <div style={{
            backgroundColor: '#F2F4EE',
            padding: '1.25rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-olive)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              ENGLISH (ORIGINAL)
            </div>
            <p style={{ fontSize: '0.98rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
              {englishQuestionText}
            </p>
          </div>

          {/* Right Card: TANGLISH or TAMIL */}
          <div style={{
            backgroundColor: 'var(--bg-sage)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-lg)',
            borderLeft: '4px solid var(--text-forest)',
            borderTop: '1px solid var(--border-olive)',
            borderRight: '1px solid var(--border-olive)',
            borderBottom: '1px solid var(--border-olive)',
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-forest)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              {language === 'tanglish' ? 'TANGLISH (SPOKEN TAMIL IN ENGLISH)' : 'TAMIL (தமிழ்)'}
            </div>
            <p className={language === 'ta' ? 'font-tamil' : ''} style={{
              fontSize: '1.02rem',
              color: 'var(--text-forest)',
              lineHeight: 1.7,
              fontWeight: 500
            }}>
              {currentQuestionText}
            </p>
          </div>
        </div>
      ) : (
        <div style={{
          backgroundColor: 'var(--bg-muted)',
          padding: '1.25rem',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '1.5rem',
          borderLeft: '4px solid var(--text-forest)'
        }}>
          <p className={language === 'ta' ? 'font-tamil' : ''} style={{
            fontSize: '1.08rem',
            color: 'var(--text-primary)',
            lineHeight: 1.7
          }}>
            {currentQuestionText}
          </p>
        </div>
      )}

      {/* Code Snippet with "🐍 Try in Code Editor" Button */}
      {question.code_snippet && (
        <div style={{
          position: 'relative',
          marginBottom: '1.5rem',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          backgroundColor: '#18241E',
          border: '1px solid rgba(120, 145, 122, 0.4)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.45rem 1rem',
            backgroundColor: '#131D18',
            borderBottom: '1px solid rgba(220, 232, 213, 0.1)',
            fontSize: '0.75rem',
            color: '#78917A',
            fontFamily: 'var(--font-mono)'
          }}>
            <span>Python Snippet</span>
            <button
              onClick={handleOpenEditor}
              className="btn btn-sm"
              style={{
                backgroundColor: 'rgba(220, 232, 213, 0.15)',
                color: '#DCE8D5',
                padding: '0.2rem 0.55rem',
                fontSize: '0.74rem',
                borderRadius: '4px',
                gap: '0.3rem'
              }}
              title="Open code in slide-over playground"
            >
              <Terminal size={12} />
              <span>🐍 Try in Code Editor</span>
            </button>
          </div>
          <pre style={{
            margin: 0,
            padding: '1rem 1.25rem',
            color: '#DCE8D5',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.92rem',
            lineHeight: 1.55,
            overflowX: 'auto'
          }}>
            <code>{question.code_snippet}</code>
          </pre>
        </div>
      )}

      {/* MCQ Options */}
      {question.options && question.options.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {question.options.map((opt) => {
            const isSelected = selectedOption === opt.option_key;
            let borderColor = 'var(--border-color)';
            let bgColor = 'var(--bg-surface)';

            if (feedback) {
              if (opt.option_key === feedback.correct_answer.split(':')[0].trim()) {
                borderColor = 'var(--success)';
                bgColor = 'var(--success-subtle)';
              } else if (isSelected && !feedback.is_correct) {
                borderColor = 'var(--error)';
                bgColor = 'var(--error-subtle)';
              }
            } else if (isSelected) {
              borderColor = 'var(--text-forest)';
              bgColor = 'var(--bg-sage)';
            }

            return (
              <div
                key={opt.id}
                onClick={() => handleOptionClick(opt.option_key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: `2px solid ${borderColor}`,
                  backgroundColor: bgColor,
                  cursor: feedback ? 'default' : 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  backgroundColor: isSelected ? 'var(--text-forest)' : 'var(--bg-muted)',
                  color: isSelected ? '#ffffff' : 'var(--text-olive)',
                  flexShrink: 0
                }}>
                  {opt.option_key}
                </div>
                <div style={{ fontSize: '0.98rem', color: 'var(--text-primary)', flex: 1, lineHeight: 1.5 }}>
                  {opt.option_text}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick In-Page Code Editor Doubts Button */}
      <div style={{ marginBottom: '1.25rem', display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
        <button
          onClick={handleOpenEditor}
          className="btn btn-secondary btn-sm"
          style={{
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-olive)',
            fontSize: '0.82rem',
            padding: '0.35rem 0.85rem'
          }}
          title="Open slide-over code editor on this same page"
        >
          <Terminal size={14} />
          <span>🐍 Open Python Editor to Test / Clear Doubts</span>
        </button>

        {/* Hints Toggle */}
        {question.hints && (
          <button
            onClick={() => setShowHint(prev => !prev)}
            className="btn btn-outline btn-sm"
            style={{ borderRadius: 'var(--radius-full)', fontSize: '0.82rem', padding: '0.35rem 0.85rem' }}
          >
            <Lightbulb size={14} style={{ color: 'var(--text-olive)' }} />
            <span>{showHint ? 'Hide Hint' : 'Need a Hint?'}</span>
          </button>
        )}
      </div>

      {showHint && question.hints && (
        <div className="animate-fade-in" style={{
          marginBottom: '1.25rem',
          padding: '0.85rem 1.25rem',
          backgroundColor: 'var(--bg-sage)',
          border: '1px solid var(--border-olive)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.88rem',
          color: 'var(--text-forest)'
        }}>
          💡 <strong>Hint:</strong> {question.hints}
        </div>
      )}

      {/* Feedback & Explanation Card (No Gamification Points) */}
      {feedback && (
        <div className="animate-fade-in" style={{
          padding: '1.25rem',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: feedback.is_correct ? 'var(--success-subtle)' : 'var(--error-subtle)',
          border: `1px solid ${feedback.is_correct ? 'rgba(52, 168, 83, 0.4)' : 'rgba(229, 72, 77, 0.4)'}`,
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            {feedback.is_correct ? (
              <>
                <CheckCircle2 size={22} style={{ color: 'var(--success)' }} />
                <span style={{ fontWeight: 800, color: 'var(--success)', fontSize: '1.05rem' }}>
                  Correct Answer! ✓
                </span>
              </>
            ) : (
              <>
                <XCircle size={22} style={{ color: 'var(--error)' }} />
                <span style={{ fontWeight: 800, color: 'var(--error)', fontSize: '1.05rem' }}>
                  Incorrect. Correct Answer: {feedback.correct_answer}
                </span>
              </>
            )}
          </div>

          {feedback.explanation && (
            <div style={{ marginTop: '0.6rem', fontSize: '0.92rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
              <strong>Explanation:</strong> {feedback.explanation}
            </div>
          )}
        </div>
      )}

      {/* Action Footer: Submit Answer or Next Question */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTop: '1px solid var(--border-color)',
        paddingTop: '1.25rem'
      }}>
        <div>
          {feedback && !feedback.is_correct && (
            <button
              onClick={() => {
                setSelectedOption('');
                setCodeAnswer('');
              }}
              className="btn btn-outline btn-sm"
            >
              <RotateCcw size={14} />
              <span>Retry Question</span>
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {!feedback ? (
            <button
              onClick={handleSubmit}
              disabled={(!selectedOption && !codeAnswer) || isSubmitting}
              className="btn btn-primary"
              style={{
                opacity: (!selectedOption && !codeAnswer) || isSubmitting ? 0.6 : 1,
                cursor: (!selectedOption && !codeAnswer) || isSubmitting ? 'not-allowed' : 'pointer'
              }}
            >
              {isSubmitting ? 'Evaluating...' : 'Check Answer'}
            </button>
          ) : (
            showNextButton && onNext && (
              <button onClick={onNext} className="btn btn-primary">
                <span>Next Question</span>
                <ArrowRight size={16} />
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
