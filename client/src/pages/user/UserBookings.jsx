import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { HiClipboardList, HiCheckCircle, HiXCircle, HiClock } from 'react-icons/hi';

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await API.get('/bookings/my');
        setBookings(data.bookings || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const statusIcon = (s) => {
    if (s === 'approved') return <HiCheckCircle style={{ color: '#10b981' }} />;
    if (s === 'rejected') return <HiXCircle style={{ color: '#ef4444' }} />;
    return <HiClock style={{ color: '#f59e0b' }} />;
  };
  const statusColor = (s) => {
    if (s === 'approved') return { bg: 'rgba(16,185,129,0.15)', color: '#34d399' };
    if (s === 'rejected') return { bg: 'rgba(239,68,68,0.15)', color: '#f87171' };
    return { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24' };
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><div className="loader"></div></div>;

  return (
    <div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f1f5f9', marginBottom: 24, fontFamily: 'Outfit', display: 'flex', alignItems: 'center', gap: 12 }}>
        <HiClipboardList style={{ color: '#8b5cf6' }} /> My Bookings
      </h1>
      {bookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.06)' }}>
          <HiClipboardList style={{ fontSize: '3rem', color: '#475569', marginBottom: 12 }} />
          <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>No bookings yet.</p>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Book a site visit on any property to see it here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {bookings.map(b => {
            const sc = statusColor(b.status);
            return (
              <div key={b._id} style={{ display: 'flex', gap: 20, padding: 20, background: 'rgba(255,255,255,0.03)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)', alignItems: 'center', flexWrap: 'wrap' }}>
                <img src={b.property?.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200&h=130&fit=crop'} alt="" style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 12, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 200 }}>
                  <h3 style={{ color: '#e2e8f0', fontSize: '1.05rem', fontWeight: 700, margin: 0, fontFamily: 'Outfit' }}>{b.property?.title || 'Property'}</h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '4px 0' }}>{b.property?.location}</p>
                  <p style={{ color: '#64748b', fontSize: '0.8rem', margin: 0 }}>{b.message || 'No message'}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 14px', borderRadius: 20, background: sc.bg, color: sc.color, fontSize: '0.8rem', fontWeight: 600, textTransform: 'capitalize' }}>
                    {statusIcon(b.status)} {b.status}
                  </span>
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

export default UserBookings;
