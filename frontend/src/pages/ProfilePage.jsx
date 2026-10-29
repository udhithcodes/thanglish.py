import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { User, Shield, Check, Award, Mail, Sparkles, AlertCircle } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const { language, setLanguage, languages } = useLanguage();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [preferredLang, setPreferredLang] = useState(user?.preferred_language || language || 'tanglish');
  const [currentLevel, setCurrentLevel] = useState(user?.current_level || 'Beginner');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');
    try {
      await updateProfile({
        full_name: fullName.trim(),
        preferred_language: preferredLang,
        current_level: currentLevel,
      });
      setLanguage(preferredLang);
      setMessage('Profile settings updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2.5rem 0 5rem' }}>
      <div className="app-container" style={{ maxWidth: '780px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>
          Student Profile & Preferences
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Manage your account information and default question language.
        </p>

        {/* Student ID Virtual Badge Card */}
        <div className="card" style={{
          background: 'linear-gradient(135deg, var(--nebula-base) 0%, var(--nebula-card) 100%)',
          color: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-lg)',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(245, 231, 161, 0.2)'
        }}>
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(203, 118, 74, 0.3) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🐍</span>
              <span style={{ fontWeight: 800, letterSpacing: '-0.02em', fontSize: '1.15rem' }}>
                thanglish<span style={{ color: 'var(--copper-base)' }}>.py</span> Student ID
              </span>
            </div>
            <div style={{
              padding: '0.3rem 0.8rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(245, 231, 161, 0.15)',
              color: 'var(--yellow-base)',
              fontSize: '0.78rem',
              fontWeight: 700,
              border: '1px solid rgba(245, 231, 161, 0.3)'
            }}>
              VERIFIED LEARNER
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'var(--copper-base)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: 800,
              color: '#fff'
            }}>
              {user?.full_name?.charAt(0).toUpperCase() || 'S'}
            </div>
            <div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{user?.full_name}</div>
              <div style={{ fontSize: '0.85rem', color: '#c9c3dd' }}>{user?.email}</div>
              <div style={{ marginTop: '0.4rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span className="badge" style={{ backgroundColor: 'var(--copper-base)', color: '#fff', fontWeight: 800 }}>
                  ID: {user?.user_id}
                </span>
                <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff' }}>
                  {user?.role?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Settings Form */}
        <div className="card" style={{
          backgroundColor: 'var(--bg-elevated)',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          {message && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              backgroundColor: 'var(--success-subtle)',
              color: 'var(--success)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              fontSize: '0.9rem'
            }}>
              <Check size={18} />
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              backgroundColor: 'var(--error-subtle)',
              color: 'var(--error)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              fontSize: '0.9rem'
            }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label" htmlFor="profile-name">
                Full Name
              </label>
              <input
                id="profile-name"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-email">
                Email Address (Permanent)
              </label>
              <input
                id="profile-email"
                type="email"
                disabled
                value={user?.email || ''}
                className="form-input"
                style={{ opacity: 0.7, cursor: 'not-allowed' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Preferred Question Language
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                {languages.map(l => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setPreferredLang(l.id)}
                    className={`btn ${preferredLang === l.id ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ justifyContent: 'center' }}
                  >
                    <span>{l.label}</span>
                    <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>({l.sub})</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Current Level Track
              </label>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {['Beginner', 'Intermediate', 'Advanced'].map(lvl => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setCurrentLevel(lvl)}
                    className={`btn btn-sm ${currentLevel === lvl ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary"
              style={{ marginTop: '1rem', padding: '0.75rem 1.5rem' }}
            >
              <span>{saving ? 'Saving Changes...' : 'Save Profile'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
