import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Moon, Sun, User as UserIcon, LogOut, Bookmark, BookOpen,
  LayoutDashboard, Award, Shield, CheckCircle, ChevronDown, Sparkles
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const { language, setLanguage, compareMode, toggleCompareMode, languages } = useLanguage();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: 'var(--nav-bg)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--nav-border)',
      transition: 'all var(--transition-normal)'
    }}>
      <div className="app-container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '72px',
        gap: '1rem'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            backgroundColor: 'var(--copper-base)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(203, 118, 74, 0.35)',
            color: '#fff',
            fontWeight: 800,
            fontSize: '1.25rem'
          }}>
            🐍
          </div>
          <div>
            <div style={{
              fontWeight: 800,
              fontSize: '1.25rem',
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}>
              <span>thanglish</span>
              <span style={{ color: 'var(--copper-base)' }}>.py</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Learn Python in Your Language
            </div>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {isAuthenticated && (
            <Link to="/dashboard" className="btn btn-outline btn-sm" style={{ border: 'none' }}>
              <LayoutDashboard size={16} />
              <span>Dashboard</span>
            </Link>
          )}

          <Link to="/levels" className="btn btn-outline btn-sm" style={{ border: 'none' }}>
            <Award size={16} />
            <span>Levels</span>
          </Link>

          <Link to="/topics" className="btn btn-outline btn-sm" style={{ border: 'none' }}>
            <BookOpen size={16} />
            <span>Topics</span>
          </Link>

          <Link to="/practice" className="btn btn-outline btn-sm" style={{ border: 'none' }}>
            <Sparkles size={16} />
            <span>Practice</span>
          </Link>

          {isAuthenticated && (
            <>
              <Link to="/bookmarks" className="btn btn-outline btn-sm" style={{ border: 'none' }}>
                <Bookmark size={16} />
                <span>Saved</span>
              </Link>
              <Link to="/mistakes" className="btn btn-outline btn-sm" style={{ border: 'none' }}>
                <CheckCircle size={16} />
                <span>Review Mistakes</span>
              </Link>
            </>
          )}

          {isAdmin && (
            <Link to="/admin" className="badge badge-copper" style={{ textDecoration: 'none', padding: '0.4rem 0.75rem' }}>
              <Shield size={14} />
              <span>Admin Panel</span>
            </Link>
          )}
        </nav>

        {/* Right Actions: Language Switcher, Theme Toggle, Auth Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Language Switcher Segmented Control */}
          <div className="lang-switcher" title="Switch Question Language">
            {languages.map(l => (
              <button
                key={l.id}
                onClick={() => setLanguage(l.id)}
                className={`lang-btn ${language === l.id ? 'active' : ''}`}
                style={{ fontSize: l.id === 'ta' ? '0.9rem' : '0.82rem' }}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: 'var(--radius-full)', width: '38px', height: '38px', padding: 0 }}
            title={isDark ? 'Switch to Warm Seashell Light Mode' : 'Switch to Atmospheric Nebula Dark Mode'}
            aria-label="Toggle color theme"
          >
            {isDark ? <Sun size={17} style={{ color: 'var(--yellow-base)' }} /> : <Moon size={17} style={{ color: 'var(--copper-base)' }} />}
          </button>

          {/* User Profile / Login */}
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setDropdownOpen(prev => !prev)}
                className="btn btn-secondary btn-sm"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.35rem 0.85rem 0.35rem 0.4rem',
                  border: '1px solid var(--border-color)'
                }}
              >
                {user.profile_picture ? (
                  <img
                    src={user.profile_picture}
                    alt={user.full_name}
                    style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--copper-base)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.82rem'
                  }}>
                    {user.full_name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {user.full_name?.split(' ')[0]}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--copper-base)', fontWeight: 600 }}>
                    {user.user_id}
                  </div>
                </div>
                <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
              </button>

              {/* Profile Dropdown */}
              {dropdownOpen && (
                <div
                  className="animate-fade-in"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '240px',
                    backgroundColor: 'var(--bg-elevated)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-lg)',
                    padding: '0.75rem',
                    zIndex: 1000
                  }}
                >
                  <div style={{ padding: '0.5rem 0.5rem 0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                      {user.full_name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {user.email}
                    </div>
                    <div style={{
                      marginTop: '0.4rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.2rem 0.5rem',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--copper-subtle)',
                      color: 'var(--copper-base)',
                      fontSize: '0.72rem',
                      fontWeight: 700
                    }}>
                      ID: {user.user_id}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.5rem' }}>
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="btn btn-secondary btn-sm"
                      style={{ justifyContent: 'flex-start', width: '100%', border: 'none' }}
                    >
                      <UserIcon size={15} />
                      <span>Profile & Settings</span>
                    </Link>
                    <Link
                      to="/history"
                      onClick={() => setDropdownOpen(false)}
                      className="btn btn-secondary btn-sm"
                      style={{ justifyContent: 'flex-start', width: '100%', border: 'none' }}
                    >
                      <Award size={15} />
                      <span>Quiz History</span>
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="btn btn-secondary btn-sm"
                        style={{ justifyContent: 'flex-start', width: '100%', border: 'none' }}
                      >
                        <Shield size={15} />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="btn btn-sm"
                      style={{
                        justifyContent: 'flex-start',
                        width: '100%',
                        color: 'var(--error)',
                        marginTop: '0.25rem'
                      }}
                    >
                      <LogOut size={15} />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Log In
              </Link>
              <Link to="/signup" className="btn btn-primary btn-sm">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
