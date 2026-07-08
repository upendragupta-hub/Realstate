import { useState, useEffect } from 'react';
import { getStats } from '../../api/adminApi';
import StatsCard from '../../components/StatsCard';
import {
  HiUsers, HiHome, HiClipboardList, HiClock, HiCheckCircle, HiTrendingUp,
  HiUserGroup, HiMail, HiKey, HiEye
} from 'react-icons/hi';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState({ bookings: [], properties: [], users: [], topViewed: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getStats();
        setStats(data.stats);
        setRecent({
          bookings: data.recentBookings,
          properties: data.recentProperties,
          users: data.recentUsers,
          topViewed: data.reports.topViewedProperties
        });
      } catch (err) { console.error(err); } finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><div className="loader"></div></div>;

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'Outfit', color: '#f1f5f9', marginBottom: 6 }}>Dashboard</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>Welcome to the admin panel overview</p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20, marginBottom: 40 }}>
        <StatsCard icon={<HiUsers />} label="Total Users" value={stats?.totalUsers || 0} color="#6366f1" delay={0} />
        <StatsCard icon={<HiUserGroup />} label="Total Agents" value={stats?.totalAgents || 0} color="#f59e0b" delay={50} />
        <StatsCard icon={<HiHome />} label="Total Properties" value={stats?.totalProperties || 0} color="#8b5cf6" delay={100} />
        <StatsCard icon={<HiClipboardList />} label="Total Bookings" value={stats?.totalBookings || 0} color="#06b6d4" delay={200} />
        <StatsCard icon={<HiMail />} label="Contact Msgs" value={stats?.totalContacts || 0} color="#ec4899" delay={250} />
        <StatsCard icon={<HiClock />} label="Pending Bookings" value={stats?.pendingBookings || 0} color="#f59e0b" delay={300} />
        <StatsCard icon={<HiCheckCircle />} label="Available Props" value={stats?.availableProperties || 0} color="#10b981" delay={400} />
        <StatsCard icon={<HiTrendingUp />} label="Sold Properties" value={stats?.soldProperties || 0} color="#ef4444" delay={500} />
        <StatsCard icon={<HiKey />} label="Rented Properties" value={stats?.rentedProperties || 0} color="#f97316" delay={600} />
      </div>

      {/* Analytics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24, marginBottom: 40 }}>
        {/* Sale vs Rent */}
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: 24, borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#e2e8f0', fontSize: '1.1rem' }}>Property Breakdown</h3>
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: 120 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#3b82f6' }}>{stats?.saleProperties || 0}</div>
              <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>For Sale</div>
            </div>
            <div style={{ width: 1, height: 80, background: 'rgba(255,255,255,0.1)' }}></div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981' }}>{stats?.rentProperties || 0}</div>
              <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>For Rent</div>
            </div>
          </div>
        </div>

        {/* Top Viewed Properties */}
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: 24, borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#e2e8f0', fontSize: '1.1rem' }}>Top Viewed Properties</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recent.topViewed.map(p => (
              <div key={p._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ color: '#cbd5e1', fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 220 }}>
                  {p.title}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#818cf8', fontWeight: 600, fontSize: '0.9rem' }}>
                  <HiEye /> {p.views} views
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24 }}>
        {/* Recent Bookings */}
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'Outfit', color: '#e2e8f0', marginBottom: 16 }}>Recent Bookings</h3>
          <div className="table-container">
            <table>
              <thead><tr><th>User</th><th>Property</th><th>Status</th></tr></thead>
              <tbody>
                {recent.bookings.length > 0 ? recent.bookings.map(b => (
                  <tr key={b._id}>
                    <td>{b.user?.name || 'N/A'}</td>
                    <td style={{ maxWidth: 180, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.property?.title || 'N/A'}</td>
                    <td><span className={`badge badge-${b.status}`}>{b.status}</span></td>
                  </tr>
                )) : <tr><td colSpan={3} style={{ textAlign: 'center', color: '#64748b' }}>No bookings yet</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Properties */}
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'Outfit', color: '#e2e8f0', marginBottom: 16 }}>Recent Properties</h3>
          <div className="table-container">
            <table>
              <thead><tr><th>Title</th><th>Price</th><th>Status</th></tr></thead>
              <tbody>
                {recent.properties.length > 0 ? recent.properties.map(p => (
                  <tr key={p._id}>
                    <td style={{ maxWidth: 180, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</td>
                    <td>${p.price?.toLocaleString()}</td>
                    <td><span className={`badge badge-${p.status}`}>{p.status}</span></td>
                  </tr>
                )) : <tr><td colSpan={3} style={{ textAlign: 'center', color: '#64748b' }}>No properties yet</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Users */}
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'Outfit', color: '#e2e8f0', marginBottom: 16 }}>Recent Users</h3>
          <div className="table-container">
            <table>
              <thead><tr><th>Name</th><th>Role</th><th>Status</th></tr></thead>
              <tbody>
                {recent.users.length > 0 ? recent.users.map(u => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td><span style={{ textTransform: 'capitalize', color: '#94a3b8' }}>{u.role}</span></td>
                    <td><span className={`badge badge-${u.status === 'active' ? 'approved' : 'rejected'}`}>{u.status}</span></td>
                  </tr>
                )) : <tr><td colSpan={3} style={{ textAlign: 'center', color: '#64748b' }}>No users yet</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
