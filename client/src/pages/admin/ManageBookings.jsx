import { useState, useEffect } from 'react';
import { getAllBookings, updateBookingStatus } from '../../api/bookingApi';
import { HiCheck, HiX } from 'react-icons/hi';
import toast, { Toaster } from 'react-hot-toast';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const fetchBookings = async () => {
    try {
      const params = {};
      if (filter) params.status = filter;
      const { data } = await getAllBookings(params);
      setBookings(data.bookings);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchBookings(); }, [filter]);

  const handleStatus = async (id, status) => {
    try {
      await updateBookingStatus(id, status);
      toast.success(`Booking ${status}`);
      fetchBookings();
    } catch (err) { toast.error('Failed to update'); }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><div className="loader"></div></div>;

  return (
    <div>
      <Toaster position="top-right" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Outfit', color: '#f1f5f9' }}>Manage Bookings</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{bookings.length} bookings</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['', 'pending', 'approved', 'rejected'].map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{ padding: '8px 16px', borderRadius: 10, border: filter === s ? '1px solid rgba(99,102,241,0.5)' : '1px solid rgba(255,255,255,0.08)', background: filter === s ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)', color: filter === s ? '#818cf8' : '#94a3b8', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', textTransform: 'capitalize' }}>
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead><tr><th>User</th><th>Property</th><th>Phone</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b._id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{b.user?.name || b.name}</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{b.user?.email || b.email}</div>
                </td>
                <td style={{ maxWidth: 180, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.property?.title || 'N/A'}</td>
                <td>{b.phone}</td>
                <td><span className={`badge badge-${b.status}`}>{b.status}</span></td>
                <td style={{ fontSize: '0.85rem' }}>{new Date(b.createdAt).toLocaleDateString()}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {b.status !== 'approved' && (
                      <button className="btn-success" style={{ padding: '5px 10px', fontSize: '0.78rem' }} onClick={() => handleStatus(b._id, 'approved')}>
                        <HiCheck /> Approve
                      </button>
                    )}
                    {b.status !== 'rejected' && (
                      <button className="btn-danger" style={{ padding: '5px 10px', fontSize: '0.78rem' }} onClick={() => handleStatus(b._id, 'rejected')}>
                        <HiX /> Reject
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {bookings.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', color: '#64748b', padding: 40 }}>No bookings found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageBookings;
