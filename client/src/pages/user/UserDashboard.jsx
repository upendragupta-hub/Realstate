import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { HiHome, HiHeart, HiEye, HiClipboardList } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const UserDashboard = () => {
  const { user } = useSelector(state => state.auth);
  const [stats, setStats] = useState({ wishlist: 0, bookings: 0, recentlyViewed: 0, properties: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [wishRes, bookRes, viewRes, propRes] = await Promise.all([
          API.get('/properties/my/wishlist'),
          API.get('/bookings/my'),
          API.get('/properties/my/recentlyviewed'),
          API.get('/properties/my/properties'),
        ]);
        setStats({
          wishlist: wishRes.data.properties?.length || 0,
          bookings: bookRes.data.bookings?.length || 0,
          recentlyViewed: viewRes.data.properties?.length || 0,
          properties: propRes.data.properties?.length || 0,
        });
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: 'Saved Properties', value: stats.wishlist, icon: <HiHeart />, color: '#ef4444', link: '/dashboard/wishlist' },
    { label: 'My Bookings', value: stats.bookings, icon: <HiClipboardList />, color: '#8b5cf6', link: '/dashboard/bookings' },
    { label: 'Recently Viewed', value: stats.recentlyViewed, icon: <HiEye />, color: '#06b6d4', link: '/dashboard/recently-viewed' },
    { label: 'My Properties', value: stats.properties, icon: <HiHome />, color: '#10b981', link: '/dashboard/properties' },
  ];

  return (
    <div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f1f5f9', marginBottom: 8, fontFamily: 'Outfit' }}>Welcome, {user?.name}! 👋</h1>
      <p style={{ color: '#94a3b8', marginBottom: 32 }}>Here's an overview of your activity.</p>
      {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="loader"></div></div> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
          {cards.map((c, i) => (
            <Link key={i} to={c.link} style={{ textDecoration: 'none' }}>
              <div style={{ padding: 24, borderRadius: 20, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', transition: 'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = c.color + '40'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: c.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', color: c.color, marginBottom: 16 }}>{c.icon}</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', fontFamily: 'Outfit' }}>{c.value}</div>
                <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: 4 }}>{c.label}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
export default UserDashboard;
