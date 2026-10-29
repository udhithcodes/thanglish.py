import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { quizService } from '../services/quizService';
import { Clock, Award, Play, AlertCircle, ArrowRight } from 'lucide-react';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const data = await quizService.getHistory();
        setHistory(data);
      } catch (err) {
        console.error('Failed to load history', err);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, []);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}m ${rem}s`;
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2.5rem 0 5rem' }}>
      <div className="app-container" style={{ maxWidth: '900px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Quiz History & Performance
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Review all your completed timed tests and accuracy ratings over time.
            </p>
          </div>

          <Link to="/quiz" className="btn btn-primary">
            <Play size={16} />
            <span>Take New Quiz</span>
          </Link>
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
            <p style={{ color: 'var(--text-secondary)' }}>Loading history records...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="card" style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            backgroundColor: 'var(--bg-elevated)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-color)'
          }}>
            <Clock size={44} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              No Quiz History Yet
            </h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
              Take a Python Speed Quiz to track your scores, speed, and accuracy here.
            </p>
            <Link to="/quiz" className="btn btn-primary">
              <Play size={16} />
              <span>Start Speed Quiz</span>
            </Link>
          </div>
        ) : (
          <div className="card" style={{
            backgroundColor: 'var(--bg-elevated)',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{
                    backgroundColor: 'var(--bg-muted)',
                    borderBottom: '1px solid var(--border-color)',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    fontSize: '0.78rem'
                  }}>
                    <th style={{ padding: '1rem 1.25rem' }}>Date & Time</th>
                    <th style={{ padding: '1rem 1.25rem' }}>Level</th>
                    <th style={{ padding: '1rem 1.25rem' }}>Questions</th>
                    <th style={{ padding: '1rem 1.25rem' }}>Accuracy</th>
                    <th style={{ padding: '1rem 1.25rem' }}>Score</th>
                    <th style={{ padding: '1rem 1.25rem' }}>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item, idx) => (
                    <tr
                      key={item.id || idx}
                      style={{
                        borderBottom: '1px solid var(--border-color)',
                        transition: 'background-color var(--transition-fast)'
                      }}
                    >
                      <td style={{ padding: '1rem 1.25rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                        {item.created_at ? new Date(item.created_at).toLocaleString() : 'N/A'}
                      </td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <span className="badge badge-copper">
                          {item.level || 'Mixed'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.25rem', color: 'var(--text-secondary)' }}>
                        {item.total_questions} Qs
                      </td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <span style={{
                          fontWeight: 800,
                          color: item.accuracy >= 60 ? 'var(--success)' : 'var(--error)'
                        }}>
                          {Math.round(item.accuracy)}%
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        +{item.score} pts
                      </td>
                      <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)' }}>
                        {formatTime(item.time_taken_seconds || 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
