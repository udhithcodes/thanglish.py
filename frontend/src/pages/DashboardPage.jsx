import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { progressService } from '../services/quizService';
import {
  LayoutDashboard, Award, CheckCircle2, Bookmark, Target,
  TrendingUp, Sparkles, BookOpen, AlertCircle, ArrowRight, Clock
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProgress() {
      try {
        const res = await progressService.getDashboardProgress();
        setData(res);
      } catch (err) {
        setError('Failed to fetch learning progress: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
    loadProgress();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 1rem' }}>
        <div style={{
          width: '36px',
          height: '36px',
          border: '3px solid var(--copper-subtle)',
          borderTopColor: 'var(--copper-base)',
          borderRadius: '50%',
          margin: '0 auto 1rem',
          animation: 'spin 0.8s linear infinite'
        }} />
        <p style={{ color: 'var(--text-secondary)' }}>Loading your Python learning progress...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="app-container" style={{ padding: '3rem 0' }}>
        <div className="card" style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'var(--bg-elevated)' }}>
          <AlertCircle size={36} style={{ color: 'var(--error)', margin: '0 auto 1rem' }} />
          <h3>Could not load dashboard</h3>
          <p style={{ color: 'var(--text-secondary)' }}>{error || 'Unable to load progress data.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ padding: '2.5rem 0 5rem' }}>
      <div className="app-container">
        {/* Welcome Banner */}
        <div className="card" style={{
          backgroundColor: 'var(--bg-elevated)',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem 2.5rem',
          marginBottom: '2rem',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <span className="badge badge-copper">
                {data.current_level || 'Beginner'} Track
              </span>
              <span className="badge" style={{ backgroundColor: 'var(--yellow-subtle)', color: 'var(--badge-text)' }}>
                ID: {user?.user_id}
              </span>
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Vanakkam, {user?.full_name?.split(' ')[0]}! 🐍
            </h1>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Track your Python mastery, practice questions in Tanglish, and review your mistakes.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/practice" className="btn btn-primary">
              <Sparkles size={16} />
              <span>Continue Practice</span>
            </Link>
            <Link to="/quiz" className="btn btn-secondary">
              <Award size={16} />
              <span>Take Quiz</span>
            </Link>
          </div>
        </div>

        {/* Top 4 Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}>
          {/* Points */}
          <div className="card" style={{
            backgroundColor: 'var(--bg-elevated)',
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Total Points
              </span>
              <Award size={18} style={{ color: 'var(--copper-base)' }} />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--copper-base)' }}>
              {data.total_points}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Earned from practice & quizzes
            </div>
          </div>

          {/* Accuracy */}
          <div className="card" style={{
            backgroundColor: 'var(--bg-elevated)',
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Overall Accuracy
              </span>
              <Target size={18} style={{ color: 'var(--success)' }} />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)' }}>
              {Math.round(data.overall_accuracy)}%
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {data.total_correct} correct / {data.total_attempted} attempts
            </div>
          </div>

          {/* Questions Attempted */}
          <div className="card" style={{
            backgroundColor: 'var(--bg-elevated)',
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Coverage
              </span>
              <BookOpen size={18} style={{ color: 'var(--info)' }} />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {data.total_attempted} <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: 600 }}>/ {data.total_bank_questions}</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Unique questions in platform
            </div>
          </div>

          {/* Saved Bookmarks */}
          <div className="card" style={{
            backgroundColor: 'var(--bg-elevated)',
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Saved Bookmarks
              </span>
              <Bookmark size={18} style={{ color: 'var(--yellow-dark)' }} />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {data.bookmarked_count}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--copper-base)' }}>
              <Link to="/bookmarks" style={{ fontWeight: 600 }}>Review bookmarks →</Link>
            </div>
          </div>
        </div>

        {/* Personalized Recommendations */}
        {data.recommendations && data.recommendations.length > 0 && (
          <div className="card" style={{
            backgroundColor: 'var(--yellow-subtle)',
            border: '1px solid var(--yellow-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem 1.5rem',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--badge-text)', fontWeight: 700 }}>
              <TrendingUp size={18} />
              <span>AI Learning Recommendations For You</span>
            </div>
            <ul style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
              {data.recommendations.map((rec, idx) => (
                <li key={idx} style={{ marginBottom: '0.25rem' }}>{rec}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Two-Column Grid: Topic Progress & Recent Attempts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
          {/* Topic Mastery */}
          <div className="card" style={{
            backgroundColor: 'var(--bg-elevated)',
            padding: '1.75rem',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Topic Mastery
              </h3>
              <Link to="/topics" style={{ fontSize: '0.85rem', fontWeight: 600 }}>All Topics →</Link>
            </div>

            {data.topics_progress?.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Practice questions to begin building topic mastery!
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {data.topics_progress?.slice(0, 6).map((tp, idx) => {
                  const pct = tp.total > 0 ? Math.round((tp.correct / tp.total) * 100) : 0;
                  return (
                    <div key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '0.3rem' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{tp.name}</span>
                        <span style={{ color: 'var(--text-secondary)' }}>{tp.correct} / {tp.total} ({pct}%)</span>
                      </div>
                      <div style={{ height: '6px', backgroundColor: 'var(--bg-muted)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          backgroundColor: pct >= 70 ? 'var(--success)' : 'var(--copper-base)',
                          width: `${pct}%`,
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Quiz Attempts */}
          <div className="card" style={{
            backgroundColor: 'var(--bg-elevated)',
            padding: '1.75rem',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Recent Quiz Attempts
              </h3>
              <Link to="/history" style={{ fontSize: '0.85rem', fontWeight: 600 }}>View All →</Link>
            </div>

            {data.recent_attempts?.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <Clock size={32} style={{ color: 'var(--text-muted)', margin: '0 auto 0.75rem' }} />
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  No quizzes completed yet. Test yourself!
                </p>
                <Link to="/quiz" className="btn btn-primary btn-sm">
                  Start Your First Quiz
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {data.recent_attempts?.slice(0, 5).map((att, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-muted)',
                    border: '1px solid var(--border-color)'
                  }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                        {att.level || 'Mixed'} Quiz
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {att.created_at ? new Date(att.created_at).toLocaleDateString() : 'Recent'}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: att.accuracy >= 60 ? 'var(--success)' : 'var(--error)' }}>
                        {Math.round(att.accuracy)}%
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {att.score} pts
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
