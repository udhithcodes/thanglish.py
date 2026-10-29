import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  User as UserIcon, LogOut, Bookmark, BookOpen,
  LayoutDashboard, Award, Shield, CheckCircle, ChevronDown, Sparkles, Menu, X
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { language, setLanguage, languages } = useLanguage();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navLinkStyle = (path) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.42rem 0.85rem',
    borderRadius: 'var(--radius-full)',
    fontSize: '0.88rem',
    fontWeight: 600,
    color: isActive(path) ? '#ffffff' : 'var(--text-olive)',
    backgroundColor: isActive(path) ? 'var(--text-forest)' : 'transparent',
    textDecoration: 'none',
    transition: 'all var(--transition-fast)',
    whiteSpace: 'nowrap',
  });

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: 'var(--nav-bg)',
      backdropFilter: 'blur(14px)',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <div className="app-container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '68px',
        gap: '1rem',
      }}>
        {/* ── Brand Logo ── */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none', flexShrink: 0 }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            backgroundColor: 'var(--text-forest)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 3px 10px rgba(40, 56, 47, 0.28)',
            fontSize: '1.25rem',
            flexShrink: 0,
          }}>
            🐍
          </div>
          <div>
            <div style={{
              fontWeight: 800,
              fontSize: '1.2rem',
              color: 'var(--text-forest)',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}>
              thanglish<span style={{ color: 'var(--text-olive)' }}>.py</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-olive)', fontWeight: 500 }}>
              Learn Python in Your Language
            </div>
          </div>
        </Link>

        {/* ── Desktop Navigation ── */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flex: 1, marginLeft: '1.5rem' }}
             className="desktop-nav">
          {isAuthenticated && (
            <Link to="/dashboard" style={navLinkStyle('/dashboard')}>
              <LayoutDashboard size={15} />
              <span>Dashboard</span>
            </Link>
          )}

          <Link to="/levels" style={navLinkStyle('/levels')}>
            <Award size={15} />
            <span>Levels</span>
          </Link>

          <Link to="/topics" style={navLinkStyle('/topics')}>
            <BookOpen size={15} />
            <span>Topics</span>
          </Link>

          <Link to="/practice" style={navLinkStyle('/practice')}>
            <Sparkles size={15} />
            <span>Practice</span>
          </Link>

          {isAuthenticated && (
            <>
              <Link to="/bookmarks" style={navLinkStyle('/bookmarks')}>
                <Bookmark size={15} />
                <span>Saved</span>
              </Link>
              <Link to="/mistakes" style={navLinkStyle('/mistakes')}>
                <CheckCircle size={15} />
                <span>Review</span>
              </Link>
            </>
          )}

          {isAdmin && (
            <Link to="/admin" className="badge" style={{ textDecoration: 'none', padding: '0.35rem 0.75rem' }}>
              <Shield size={13} />
              <span>Admin</span>
            </Link>
          )}
        </nav>

        {/* ── Right Controls: Language Switcher + Auth ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0 }}>
          {/* Language Switcher Segmented Control */}
          <div className="lang-switcher" title="Switch Question Language">
            {languages.map(l => (
              <button
                key={l.id}
                onClick={() => setLanguage(l.id)}
                className={`lang-btn ${language === l.id ? 'active' : ''}`}
                style={{ fontSize: l.id === 'ta' ? '0.88rem' : '0.8rem' }}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Auth Controls — directly right of language switcher */}
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
                  padding: '0.35rem 0.9rem 0.35rem 0.4rem',
                  border: '1px solid var(--border-olive)',
                }}
              >
                {user.profile_picture ? (
                  <img
                    src={user.profile_picture}
                    alt={user.full_name}
                    style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--text-forest)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                  }}>
                    {user.full_name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-forest)' }}>
                    {user.full_name?.split(' ')[0]}
                  </div>
                  <div style={{ fontSize: '0.66rem', color: 'var(--text-olive)', fontWeight: 600 }}>
                    {user.user_id}
                  </div>
                </div>
                <ChevronDown size={13} style={{ color: 'var(--text-olive)' }} />
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
                    backgroundColor: 'var(--surface-white)',
                    border: '1px solid var(--border-olive)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-lg)',
                    padding: '0.75rem',
                    zIndex: 1000,
                  }}
                >
                  <div style={{ padding: '0.5rem 0.5rem 0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-forest)' }}>
                      {user.full_name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-olive)' }}>
                      {user.email}
                    </div>
                    <div style={{
                      marginTop: '0.4rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.2rem 0.55rem',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--bg-sage)',
                      color: 'var(--text-forest)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      border: '1px solid var(--border-olive)',
                    }}>
                      ID: {user.user_id}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.5rem' }}>
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="btn btn-secondary btn-sm"
                      style={{ justifyContent: 'flex-start', width: '100%', border: 'none', background: 'transparent' }}
                    >
                      <UserIcon size={15} />
                      <span>Profile & Settings</span>
                    </Link>
                    <Link
                      to="/history"
                      onClick={() => setDropdownOpen(false)}
                      className="btn btn-secondary btn-sm"
                      style={{ justifyContent: 'flex-start', width: '100%', border: 'none', background: 'transparent' }}
                    >
                      <Award size={15} />
                      <span>Quiz History</span>
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="btn btn-secondary btn-sm"
                        style={{ justifyContent: 'flex-start', width: '100%', border: 'none', background: 'transparent' }}
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
                        marginTop: '0.25rem',
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
              <Link to="/login" className="btn btn-outline btn-sm">
                Log In
              </Link>
              <Link to="/signup" className="btn btn-primary btn-sm">
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(prev => !prev)}
            className="btn btn-outline btn-sm mobile-menu-btn"
            style={{ borderRadius: 'var(--radius-md)', width: '36px', height: '36px', padding: 0 }}
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileOpen && (
        <div className="animate-fade-in" style={{
          backgroundColor: 'var(--surface-card)',
          borderTop: '1px solid var(--border-subtle)',
          padding: '1rem 1.5rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}>
          {isAuthenticated && (
            <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>
              <LayoutDashboard size={16} /><span>Dashboard</span>
            </Link>
          )}
          <Link to="/levels" onClick={() => setMobileOpen(false)} className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>
            <Award size={16} /><span>Levels</span>
          </Link>
          <Link to="/topics" onClick={() => setMobileOpen(false)} className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>
            <BookOpen size={16} /><span>Topics</span>
          </Link>
          <Link to="/practice" onClick={() => setMobileOpen(false)} className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>
            <Sparkles size={16} /><span>Practice</span>
          </Link>
          {isAuthenticated && (
            <>
              <Link to="/bookmarks" onClick={() => setMobileOpen(false)} className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>
                <Bookmark size={16} /><span>Saved</span>
              </Link>
              <Link to="/mistakes" onClick={() => setMobileOpen(false)} className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>
                <CheckCircle size={16} /><span>Review Mistakes</span>
              </Link>
            </>
          )}
          {!isAuthenticated && (
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="btn btn-outline" style={{ flex: 1 }}>Log In</Link>
              <Link to="/signup" onClick={() => setMobileOpen(false)} className="btn btn-primary" style={{ flex: 1 }}>Sign Up</Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 769px) {
          .mobile-menu-btn { display: none !important; }
        }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
        }
      `}</style>
    </header>
  );
}
