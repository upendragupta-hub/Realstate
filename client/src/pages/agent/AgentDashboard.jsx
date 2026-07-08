import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { useSelector } from 'react-redux';
import { HiHome, HiEye, HiClipboardList, HiTrendingUp } from 'react-icons/hi';

const AgentDashboard = () => {
  const { user } = useSelector(state => state.auth);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await API.get('/properties/my/analytics');
        setAnalytics(data.analytics);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const cards = analytics ? [
    { label: 'Total Properties', value: analytics.totalProperties, icon: <HiHome />, color: '#6366f1' },
    { label: 'Total Views', value: analytics.totalViews, icon: <HiEye />, color: '#06b6d4' },
    { label: 'Total Leads', value: analytics.totalLeads, icon: <HiClipboardList />, color: '#10b981' },
    { label: 'Pending Leads', value: analytics.pendingLeads, icon: <HiTrendingUp />, color: '#f59e0b' },
  ] : [];

  return (
    <div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f1f5f9', marginBottom: 8, fontFamily: 'Outfit' }}>Agent Dashboard 🏠</h1>
      <p style={{ color: '#94a3b8', marginBottom: 32 }}>Welcome back, {user?.name}!</p>
      {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="loader"></div></div> : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20, marginBottom: 36 }}>
            {cards.map((c, i) => (
              <div key={i} style={{ padding: 24, borderRadius: 20, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: c.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', color: c.color, marginBottom: 16 }}>{c.icon}</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', fontFamily: 'Outfit' }}>{c.value}</div>
                <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: 4 }}>{c.label}</div>
              </div>
            ))}
          </div>
          {analytics?.properties?.length > 0 && (
            <div>
              <h2 style={{ color: '#e2e8f0', fontSize: '1.2rem', fontWeight: 700, marginBottom: 16, fontFamily: 'Outfit' }}>Property Performance</h2>
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      {['Property', 'Views', 'Status', 'Price'].map(h => (
                        <th key={h} style={{ padding: '14px 20px', textAlign: 'left', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.properties.map(p => (
                      <tr key={p._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '14px 20px', color: '#e2e8f0', fontSize: '0.9rem' }}>{p.title}</td>
                        <td style={{ padding: '14px 20px', color: '#06b6d4', fontWeight: 600 }}>{p.views}</td>
                        <td style={{ padding: '14px 20px' }}><span style={{ padding: '3px 12px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600, textTransform: 'capitalize', background: p.status === 'available' ? 'rgba(16,185,129,0.15)' : 'rgba(139,92,246,0.15)', color: p.status === 'available' ? '#34d399' : '#a78bfa' }}>{p.status}</span></td>
                        <td style={{ padding: '14px 20px', color: '#e2e8f0', fontWeight: 700 }}>₹{p.price?.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default AgentDashboard;
