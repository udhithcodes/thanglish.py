import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { questionService } from '../services/questionService';
import QuestionCard from '../components/QuestionCard';
import confetti from 'canvas-confetti';
import { Bookmark, Sparkles, BookOpen, AlertCircle, ArrowRight } from 'lucide-react';

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [activeQuestionId, setActiveQuestionId] = useState(null);

  const loadBookmarks = async () => {
    setLoading(true);
    try {
      const data = await questionService.getBookmarks();
      setBookmarks(data);
    } catch (err) {
      console.error('Failed to load bookmarks', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookmarks();
  }, []);

  const handleBookmarkToggle = async (questionId) => {
    try {
      await questionService.toggleBookmark(questionId);
      // Remove from local list
      setBookmarks(prev => prev.filter(q => q.id !== questionId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAnswerSubmit = async (payload) => {
    try {
      const res = await questionService.evaluateAnswer(payload);
      setActiveQuestionId(payload.question_id);
      setFeedback(res);
      if (res.is_correct) {
        confetti({
          particleCount: 60,
          spread: 60,
          colors: ['#28382F', '#DCE8D5', '#34A853']
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
            backgroundColor: 'var(--bg-sage)',
            color: 'var(--text-forest)',
            fontWeight: 700,
            fontSize: '0.85rem',
            marginBottom: '0.75rem'
          }}>
            <Bookmark size={15} />
            <span>Saved for Review</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Bookmarked Questions ({bookmarks.length})
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Revise difficult questions you flagged during your learning journey.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              border: '3px solid var(--bg-sage)',
              borderTopColor: 'var(--text-forest)',
              borderRadius: '50%',
              margin: '0 auto 1rem',
              animation: 'spin 0.8s linear infinite'
            }} />
            <p style={{ color: 'var(--text-secondary)' }}>Loading bookmarked questions...</p>
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="card" style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            backgroundColor: 'var(--bg-elevated)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-color)'
          }}>
            <Bookmark size={44} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              No Bookmarks Yet
            </h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
              Whenever you see a tricky question in the Practice Arena, tap the bookmark icon to save it here for later revision.
            </p>
            <Link to="/practice" className="btn btn-primary">
              <Sparkles size={16} />
              <span>Explore Practice Questions</span>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {bookmarks.map((q) => (
              <QuestionCard
                key={q.id}
                question={q}
                onAnswerSubmit={handleAnswerSubmit}
                onBookmarkToggle={handleBookmarkToggle}
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
