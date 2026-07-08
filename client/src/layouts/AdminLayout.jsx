import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import {
  HiChartBar, HiHome, HiUsers, HiClipboardList,
  HiLogout, HiArrowLeft, HiMenuAlt2, HiUserGroup,
  HiMail, HiCollection, HiLocationMarker, HiStar, HiUser, HiChat
} from 'react-icons/hi';
import { useState } from 'react';

const AdminLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const links = [
    { to: '/admin', icon: <HiChartBar />, label: 'Dashboard', end: true },
    { to: '/admin/properties', icon: <HiHome />, label: 'Properties' },
    { to: '/admin/users', icon: <HiUsers />, label: 'Users' },
    { to: '/admin/agents', icon: <HiUserGroup />, label: 'Agents' },
    { to: '/admin/bookings', icon: <HiClipboardList />, label: 'Bookings' },
    { to: '/admin/contacts', icon: <HiMail />, label: 'Contacts' },
    { to: '/admin/chats', icon: <HiChat />, label: 'Chats' },
    { to: '/admin/categories', icon: <HiCollection />, label: 'Categories' },
    { to: '/admin/locations', icon: <HiLocationMarker />, label: 'Locations' },
    { to: '/admin/reviews', icon: <HiStar />, label: 'Reviews' },
    { to: '/admin/profile', icon: <HiUser />, label: 'Profile' },
  ];

  const linkStyle = (isActive) => ({
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '12px 18px',
    borderRadius: 12,
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: isActive ? 600 : 500,
    color: isActive ? '#fff' : '#94a3b8',
    background: isActive ? 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15))' : 'transparent',
    border: isActive ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
    transition: 'all 0.2s ease',
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f172a' }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? 260 : 0,
        overflow: 'hidden',
        background: 'rgba(15,23,42,0.95)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.3s ease',
        position: 'fixed', top: 0, left: 0, bottom: 0,
        zIndex: 100,
      }}>
        {/* Logo */}
        <div style={{
          padding: '20px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: 12,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.1rem', fontWeight: 800, color: '#fff', flexShrink: 0,
          }}>R</div>
          <div>
            <div style={{
              fontSize: '1.1rem', fontWeight: 800,
              fontFamily: 'Outfit, sans-serif',
              background: 'linear-gradient(135deg, #818cf8, #22d3ee)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Realstate</div>
            <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Admin Panel
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto' }}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              style={({ isActive }) => linkStyle(isActive)}
              onMouseEnter={e => {
                if (!e.currentTarget.classList.contains('active')) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.color = '#e2e8f0';
                }
              }}
              onMouseLeave={e => {
                if (!e.currentTarget.classList.contains('active')) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#94a3b8';
                }
              }}
            >
              <span style={{ fontSize: '1.15rem' }}>{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom section */}
        <div style={{
          padding: '16px 12px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          <button onClick={() => navigate('/')} style={{
            ...linkStyle(false),
            background: 'none', border: 'none', cursor: 'pointer',
            width: '100%',
          }}>
            <HiArrowLeft style={{ fontSize: '1.15rem' }} /> Back to Site
          </button>
          <button onClick={handleLogout} style={{
            ...linkStyle(false),
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#f87171', width: '100%',
          }}>
            <HiLogout style={{ fontSize: '1.15rem' }} /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div style={{
        flex: 1,
        marginLeft: sidebarOpen ? 260 : 0,
        transition: 'margin-left 0.3s ease',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Top bar */}
        <header style={{
          height: 64,
          background: 'rgba(15,23,42,0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 28px',
          position: 'sticky', top: 0, zIndex: 50,
        }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 10, width: 38, height: 38,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#94a3b8', cursor: 'pointer', fontSize: '1.2rem',
            }}
          >
            <HiMenuAlt2 />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.85rem', fontWeight: 700, color: '#fff',
            }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#e2e8f0' }}>{user?.name}</div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{user?.email}</div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: 28 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
