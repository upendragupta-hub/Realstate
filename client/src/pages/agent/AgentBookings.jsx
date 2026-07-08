import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { HiClipboardList, HiCheckCircle, HiXCircle, HiClock } from 'react-icons/hi';

const AgentBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await API.get('/bookings/agent');
        setBookings(data.bookings || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const statusColor = (s) => {
    if (s === 'approved') return { bg: 'rgba(16,185,129,0.15)', color: '#34d399' };
    if (s === 'rejected') return { bg: 'rgba(239,68,68,0.15)', color: '#f87171' };
    return { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24' };
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><div className="loader"></div></div>;

  return (
    <div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f1f5f9', marginBottom: 24, fontFamily: 'Outfit' }}>Booking Requests</h1>
      {bookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.06)' }}>
          <HiClipboardList style={{ fontSize: '3rem', color: '#475569', marginBottom: 12 }} />
          <p style={{ color: '#94a3b8' }}>No booking requests yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {bookings.map(b => {
            const sc = statusColor(b.status);
            return (
              <div key={b._id} style={{ display: 'flex', gap: 20, padding: 20, background: 'rgba(255,255,255,0.03)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <h3 style={{ color: '#e2e8f0', fontSize: '1rem', fontWeight: 700, margin: 0 }}>{b.property?.title || 'Property'}</h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '4px 0' }}>Buyer: {b.user?.name} ({b.user?.email})</p>
                  {b.user?.phone && <p style={{ color: '#64748b', fontSize: '0.8rem', margin: 0 }}>Phone: {b.user.phone}</p>}
                  {b.message && <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '4px 0 0', fontStyle: 'italic' }}>"{b.message}"</p>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                  <span style={{ padding: '4px 14px', borderRadius: 20, background: sc.bg, color: sc.color, fontSize: '0.8rem', fontWeight: 600, textTransform: 'capitalize' }}>{b.status}</span>
                  <span style={{ color: '#64748b', fontSize: '0.75rem' }}>{new Date(b.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default AgentBookings;
