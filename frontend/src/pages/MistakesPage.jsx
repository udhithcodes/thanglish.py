import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { questionService } from '../services/questionService';
import QuestionCard from '../components/QuestionCard';
import confetti from 'canvas-confetti';
import { AlertCircle, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';

export default function MistakesPage() {
  const [mistakes, setMistakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [activeQuestionId, setActiveQuestionId] = useState(null);

  const loadMistakes = async () => {
    setLoading(true);
    try {
      const data = await questionService.getIncorrectQuestions();
      setMistakes(data);
    } catch (err) {
      console.error('Failed to load mistakes', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMistakes();
  }, []);

  const handleAnswerSubmit = async (payload) => {
    try {
      const res = await questionService.evaluateAnswer(payload);
      setActiveQuestionId(payload.question_id);
      setFeedback(res);
      if (res.is_correct) {
        confetti({
          particleCount: 70,
          spread: 60,
          colors: ['#CB764A', '#F5E7A1', '#34A853']
        });
      }
    } catch (err) {
      alert('Error evaluating answer: ' + err.message);
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2.5rem 0 5rem' }}>
      <div className="app-container" style={{ maxWidth: '860px' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.9rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--error-subtle)',
            color: 'var(--error)',
            fontWeight: 700,
            fontSize: '0.85rem',
            marginBottom: '0.75rem'
          }}>
            <AlertCircle size={15} />
            <span>Targeted Concept Mastery</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Review Mistakes ({mistakes.length})
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Questions you answered incorrectly in practice or quizzes. Re-attempt them to solidify your understanding.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              border: '3px solid var(--copper-subtle)',
              borderTopColor: 'var(--copper-base)',
              borderRadius: '50%',
              margin: '0 auto 1rem',
              animation: 'spin 0.8s linear infinite'
            }} />
            <p style={{ color: 'var(--text-secondary)' }}>Loading mistake questions...</p>
          </div>
        ) : mistakes.length === 0 ? (
          <div className="card" style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            backgroundColor: 'var(--bg-elevated)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-color)'
          }}>
            <CheckCircle2 size={48} style={{ color: 'var(--success)', margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              No Mistakes Recorded! 🎉
            </h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
              Awesome job! Either all your attempts were correct or you haven't taken a quiz yet.
            </p>
            <Link to="/practice" className="btn btn-primary">
              <Sparkles size={16} />
              <span>Practice New Questions</span>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {mistakes.map((q) => (
              <QuestionCard
                key={q.id}
                question={q}
                onAnswerSubmit={handleAnswerSubmit}
                showNextButton={false}
                feedback={activeQuestionId === q.id ? feedback : null}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
