import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-subtle)',
      backgroundColor: 'var(--surface-card)',
      padding: '3rem 0 2rem',
      marginTop: 'auto',
    }}>
      <div className="app-container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem',
          marginBottom: '2.5rem',
        }}>
          {/* Brand Info */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
              fontWeight: 800,
              fontSize: '1.2rem',
              color: 'var(--text-forest)',
              marginBottom: '0.75rem',
            }}>
              <span>🐍 thanglish</span>
              <span style={{ color: 'var(--text-olive)' }}>.py</span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              Helping students master Python programming while improving their English comprehension
              through natural Tanglish and Tamil translations.
            </p>
            {/* Sage & Paper palette swatches */}
            <div style={{ display: 'flex', gap: '0.4rem', marginTop: '1rem', alignItems: 'center' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#F7F6EF', border: '1px solid #ccc', display: 'inline-block' }} title="Paper" />
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#DCE8D5', display: 'inline-block' }} title="Sage" />
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#78917A', display: 'inline-block' }} title="Olive" />
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#28382F', display: 'inline-block' }} title="Forest" />
            </div>
          </div>

          {/* Quick Learning Links */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-forest)', marginBottom: '0.75rem' }}>
              Learning Paths
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem' }}>
              <Link to="/levels" style={{ color: 'var(--text-secondary)' }}>Beginner Python</Link>
              <Link to="/levels" style={{ color: 'var(--text-secondary)' }}>Intermediate Challenges</Link>
              <Link to="/levels" style={{ color: 'var(--text-secondary)' }}>Advanced OOP & Algorithms</Link>
              <Link to="/practice" style={{ color: 'var(--text-secondary)' }}>Interactive Practice</Link>
            </div>
          </div>

          {/* Student Tools */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-forest)', marginBottom: '0.75rem' }}>
              Student Tools
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem' }}>
              <Link to="/topics" style={{ color: 'var(--text-secondary)' }}>All Python Topics</Link>
              <Link to="/bookmarks" style={{ color: 'var(--text-secondary)' }}>Bookmarked Questions</Link>
              <Link to="/mistakes" style={{ color: 'var(--text-secondary)' }}>Review Mistakes</Link>
              <Link to="/dashboard" style={{ color: 'var(--text-secondary)' }}>Personal Dashboard</Link>
            </div>
          </div>

          {/* Philosophy */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-forest)', marginBottom: '0.75rem' }}>
              Our Philosophy
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-olive)', lineHeight: 1.65 }}>
              Read in English → Understand in Tanglish or Tamil → Solve in Python → Learn from mistakes → Improve English & Python together.
            </p>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.82rem',
          color: 'var(--text-olive)',
        }}>
          <div>
            © {new Date().getFullYear()} thanglish.py — Built for students learning Python across languages.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Paper · Sage · Olive · Forest</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
