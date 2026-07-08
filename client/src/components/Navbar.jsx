import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { useState } from 'react';
import { HiMenu, HiX, HiHome, HiViewGrid, HiLogin, HiUserAdd, HiLogout, HiCog } from 'react-icons/hi';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setMobileOpen(false);
  };

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 72,
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.2rem', fontWeight: 800, color: '#fff',
          }}>R</div>
          <span style={{
            fontSize: '1.35rem', fontWeight: 800,
            fontFamily: 'Outfit, sans-serif',
            background: 'linear-gradient(135deg, #818cf8, #22d3ee)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>Realstate</span>
        </Link>

        {/* Desktop Nav */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
        }} className="desktop-nav">
          <NavLink to="/" icon={<HiHome />}>Home</NavLink>
          <NavLink to="/listings" icon={<HiViewGrid />}>Listings</NavLink>

          {isAuthenticated ? (
            <>
              {user?.role === 'admin' && (
                <NavLink to="/admin" icon={<HiCog />}>Admin Panel</NavLink>
              )}
              {user?.role === 'agent' && (
                <NavLink to="/agent" icon={<HiCog />}>Agent Dashboard</NavLink>
              )}
              {user?.role === 'user' && (
                <NavLink to="/dashboard" icon={<HiCog />}>User Dashboard</NavLink>
              )}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                marginLeft: 8,
                padding: '8px 16px',
                borderRadius: 12,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8rem', fontWeight: 700, color: '#fff',
                }}>
                  {user?.name?.[0]?.toUpperCase()}
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#e2e8f0' }}>
                  {user?.name}
                </span>
                <button onClick={handleLogout} style={{
                  background: 'none', border: 'none', color: '#94a3b8',
                  cursor: 'pointer', fontSize: '1.2rem', display: 'flex',
                  padding: 4, borderRadius: 8,
                  transition: 'color 0.2s',
                }}
                  onMouseEnter={e => e.target.style.color = '#ef4444'}
                  onMouseLeave={e => e.target.style.color = '#94a3b8'}
                >
                  <HiLogout />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
                <HiLogin /> Login
              </Link>
              <Link to="/register" className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
                <HiUserAdd /> Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            display: 'none', background: 'none', border: 'none',
            color: '#e2e8f0', fontSize: '1.5rem', cursor: 'pointer',
          }}
          className="mobile-menu-btn"
        >
          {mobileOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', flexDirection: 'column', gap: 8,
          background: 'rgba(15, 23, 42, 0.95)',
        }} className="mobile-nav">
          <Link to="/" onClick={() => setMobileOpen(false)} style={mobileLink}>Home</Link>
          <Link to="/listings" onClick={() => setMobileOpen(false)} style={mobileLink}>Listings</Link>
          {isAuthenticated ? (
            <>
              {user?.role === 'admin' && (
                <Link to="/admin" onClick={() => setMobileOpen(false)} style={mobileLink}>Admin Panel</Link>
              )}
              {user?.role === 'agent' && (
                <Link to="/agent" onClick={() => setMobileOpen(false)} style={mobileLink}>Agent Dashboard</Link>
              )}
              {user?.role === 'user' && (
                <Link to="/dashboard" onClick={() => setMobileOpen(false)} style={mobileLink}>User Dashboard</Link>
              )}
              <button onClick={handleLogout} style={{ ...mobileLink, background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)} style={mobileLink}>Login</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} style={mobileLink}>Register</Link>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
};

const NavLink = ({ to, children, icon }) => (
  <Link to={to} style={{
    textDecoration: 'none', color: '#cbd5e1',
    padding: '8px 16px', borderRadius: 10,
    fontSize: '0.9rem', fontWeight: 500,
    display: 'flex', alignItems: 'center', gap: 6,
    transition: 'all 0.2s',
  }}
    onMouseEnter={e => {
      e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
      e.currentTarget.style.color = '#fff';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.background = 'transparent';
      e.currentTarget.style.color = '#cbd5e1';
    }}
  >
    {icon} {children}
  </Link>
);

const mobileLink = {
  textDecoration: 'none',
  color: '#cbd5e1',
  padding: '12px 16px',
  borderRadius: 10,
  fontSize: '0.95rem',
  fontWeight: 500,
};

export default Navbar;
