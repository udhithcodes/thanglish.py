import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useCodePlayground } from '../context/CodePlaygroundContext';
import {
  User as UserIcon, LogOut, Bookmark, BookOpen,
  LayoutDashboard, Shield, CheckCircle, ChevronDown, Sparkles,
  Terminal, Menu, X, Award
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { language, setLanguage, languages } = useLanguage();
  const { togglePlayground } = useCodePlayground();
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

  const isActive = (path) => location.pathname === path || (path === '/learn' && location.pathname === '/topics');

  const navLinkStyle = (path) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    padding: '0.38rem 0.75rem',
    borderRadius: 'var(--radius-full)',
    fontSize: '0.84rem',
    fontWeight: 600,
    color: isActive(path) ? '#ffffff' : 'var(--text-forest)',
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
      width: '100%',
      backgroundColor: 'var(--nav-bg)',
      backdropFilter: 'blur(14px)',
      borderBottom: '1px solid var(--border-subtle)',
      boxSizing: 'border-box',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '0.65rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxSizing: 'border-box',
        gap: '0.75rem',
      }}>
        {/* ── Left Side: Brand Logo ── */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            textDecoration: 'none',
            flexShrink: 0
          }}
        >
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '11px',
            backgroundColor: 'var(--text-forest)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(40, 56, 47, 0.22)',
            fontSize: '1.2rem',
            flexShrink: 0,
          }}>
            🐍
          </div>
          <div>
            <div style={{
              fontWeight: 800,
              fontSize: '1.18rem',
              color: 'var(--text-forest)',
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
            }}>
              thanglish<span style={{ color: 'var(--text-olive)' }}>.py</span>
            </div>
            <div style={{ fontSize: '0.66rem', color: 'var(--text-olive)', fontWeight: 500 }}>
              Learn Python in Your Language
            </div>
          </div>
        </Link>

        {/* ── Right-Aligned Group (margin-left: auto) ── */}
        <div style={{
          marginLeft: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          flexShrink: 0,
        }}>
          {/* Desktop Navigation Links */}
          <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            {isAuthenticated && (
              <Link to="/dashboard" style={navLinkStyle('/dashboard')}>
                <LayoutDashboard size={14} />
                <span>Dashboard</span>
              </Link>
            )}

            <Link to="/learn" style={navLinkStyle('/learn')}>
              <BookOpen size={14} />
              <span>Learn Topics</span>
            </Link>

            <Link to="/practice" style={navLinkStyle('/practice')}>
              <Sparkles size={14} />
              <span>Practice</span>
            </Link>

            {isAuthenticated && (
              <>
                <Link to="/bookmarks" style={navLinkStyle('/bookmarks')}>
                  <Bookmark size={14} />
                  <span>Saved</span>
                </Link>
                <Link to="/mistakes" style={navLinkStyle('/mistakes')}>
                  <CheckCircle size={14} />
                  <span>Review</span>
                </Link>
              </>
            )}

            {isAdmin && (
              <Link to="/admin" className="badge" style={{ textDecoration: 'none', padding: '0.3rem 0.65rem', fontSize: '0.78rem' }}>
                <Shield size={12} />
                <span>Admin</span>
              </Link>
            )}
          </nav>

          {/* 🐍 Code Editor Quick-Launch Button */}
          <button
            onClick={togglePlayground}
            className="btn btn-sm"
            style={{
              backgroundColor: 'var(--bg-sage)',
              color: 'var(--text-forest)',
              border: '1px solid var(--border-olive)',
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem',
              fontWeight: 700,
              gap: '0.35rem',
              whiteSpace: 'nowrap',
            }}
            title="Open Interactive Python Code Playground"
          >
            <Terminal size={14} />
            <span>&lt;_ Code Editor</span>
          </button>

          {/* Global Language Switcher Pill */}
          <div className="lang-switcher" title="Switch Interface & Question Language">
            {languages.map(l => (
              <button
                key={l.id}
                onClick={() => setLanguage(l.id)}
                className={`lang-btn ${language === l.id ? 'active' : ''}`}
                style={{ fontSize: l.id === 'ta' ? '0.85rem' : '0.78rem', padding: '0.28rem 0.6rem' }}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* User Profile Pill or Auth Links */}
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setDropdownOpen(prev => !prev)}
                className="btn btn-secondary btn-sm"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.28rem 0.75rem 0.28rem 0.35rem',
                  border: '1px solid var(--border-olive)',
                }}
              >
                {user.profile_picture ? (
                  <img
                    src={user.profile_picture}
                    alt={user.full_name}
                    style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--text-forest)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                  }}>
                    {user.full_name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <div style={{ textAlign: 'left', lineHeight: 1.15 }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-forest)' }}>
                    {user.full_name?.split(' ')[0]}
                  </div>
                  <div style={{ fontSize: '0.64rem', color: 'var(--text-olive)', fontWeight: 600 }}>
                    {user.user_id}
                  </div>
                </div>
                <ChevronDown size={12} style={{ color: 'var(--text-olive)' }} />
              </button>

              {/* Profile Dropdown */}
              {dropdownOpen && (
                <div
                  className="animate-fade-in"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '230px',
                    backgroundColor: 'var(--surface-white)',
                    border: '1px solid var(--border-olive)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-lg)',
                    padding: '0.75rem',
                    zIndex: 1000,
                  }}
                >
                  <div style={{ padding: '0.4rem 0.4rem 0.65rem', borderBottom: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-forest)' }}>
                      {user.full_name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-olive)' }}>
                      {user.email}
                    </div>
                    <div style={{
                      marginTop: '0.35rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      padding: '0.15rem 0.5rem',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--bg-sage)',
                      color: 'var(--text-forest)',
                      fontSize: '0.7rem',
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
                      <UserIcon size={14} />
                      <span>Profile & Settings</span>
                    </Link>
                    <Link
                      to="/history"
                      onClick={() => setDropdownOpen(false)}
                      className="btn btn-secondary btn-sm"
                      style={{ justifyContent: 'flex-start', width: '100%', border: 'none', background: 'transparent' }}
                    >
                      <Award size={14} />
                      <span>Quiz History</span>
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="btn btn-secondary btn-sm"
                        style={{ justifyContent: 'flex-start', width: '100%', border: 'none', background: 'transparent' }}
                      >
                        <Shield size={14} />
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
                      <LogOut size={14} />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Link to="/login" className="btn btn-outline btn-sm" style={{ padding: '0.35rem 0.75rem', fontSize: '0.82rem' }}>
                Log In
              </Link>
              <Link to="/signup" className="btn btn-primary btn-sm" style={{ padding: '0.35rem 0.8rem', fontSize: '0.82rem' }}>
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileOpen(prev => !prev)}
            className="btn btn-outline btn-sm mobile-menu-btn"
            style={{ borderRadius: 'var(--radius-md)', width: '34px', height: '34px', padding: 0 }}
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu (Collapsed on < 1024px) */}
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
          <Link to="/learn" onClick={() => setMobileOpen(false)} className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>
            <BookOpen size={16} /><span>Learn Topics</span>
          </Link>
          <Link to="/practice" onClick={() => setMobileOpen(false)} className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>
            <Sparkles size={16} /><span>Practice Questions</span>
          </Link>
          {isAuthenticated && (
            <>
              <Link to="/bookmarks" onClick={() => setMobileOpen(false)} className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>
                <Bookmark size={16} /><span>Saved Questions</span>
              </Link>
              <Link to="/mistakes" onClick={() => setMobileOpen(false)} className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>
                <CheckCircle size={16} /><span>Review Mistakes</span>
              </Link>
            </>
          )}
          <button
            onClick={() => { setMobileOpen(false); togglePlayground(); }}
            className="btn btn-secondary"
            style={{ justifyContent: 'flex-start' }}
          >
            <Terminal size={16} /><span>Open Python Code Playground</span>
          </button>
          {!isAuthenticated && (
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="btn btn-outline" style={{ flex: 1 }}>Log In</Link>
              <Link to="/signup" onClick={() => setMobileOpen(false)} className="btn btn-primary" style={{ flex: 1 }}>Sign Up</Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 1024px) {
          .mobile-menu-btn { display: none !important; }
        }
        @media (max-width: 1023px) {
          .desktop-nav { display: none !important; }
        }
      `}</style>
    </header>
  );
}
