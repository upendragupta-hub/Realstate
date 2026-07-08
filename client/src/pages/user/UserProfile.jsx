import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadUser } from '../../store/authSlice';
import API from '../../api/axios';
import toast, { Toaster } from 'react-hot-toast';
import { HiUser, HiMail, HiPhone, HiPencil, HiCheck, HiX } from 'react-icons/hi';

const UserProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '' });

  useEffect(() => {
    if (user) setForm({ name: user.name || '', phone: user.phone || '' });
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await API.put('/auth/updateprofile', form);
      dispatch(loadUser());
      toast.success('Profile updated!');
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setLoading(false);
    }
  };

  const card = {
    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 20, padding: 32,
  };
  const inputStyle = {
    width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff',
    outline: 'none', fontSize: '0.95rem',
  };
  const labelStyle = { display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' };

  return (
    <div>
      <Toaster position="top-right" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f1f5f9', fontFamily: 'Outfit' }}>My Profile</h1>
        {!editing ? (
          <button onClick={() => setEditing(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>
            <HiPencil /> Edit Profile
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleSave} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', background: '#10b981', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
              <HiCheck /> {loading ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => { setEditing(false); setForm({ name: user.name, phone: user.phone || '' }); }} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#94a3b8', fontWeight: 600, cursor: 'pointer' }}>
              <HiX /> Cancel
            </button>
          </div>
        )}
      </div>

      <div style={{ ...card, maxWidth: 600 }}>
        {/* Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32, paddingBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 800, color: '#fff', flexShrink: 0 }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', color: '#fff', margin: 0, fontFamily: 'Outfit' }}>{user?.name}</h2>
            <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: '0.85rem' }}>
              <span style={{ padding: '2px 10px', borderRadius: 20, background: 'rgba(99,102,241,0.15)', color: '#818cf8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>{user?.role}</span>
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={labelStyle}><HiUser style={{ verticalAlign: 'middle' }} /> Full Name</label>
            {editing ? (
              <input style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            ) : (
              <div style={{ color: '#e2e8f0', fontSize: '1.05rem' }}>{user?.name}</div>
            )}
          </div>
          <div>
            <label style={labelStyle}><HiMail style={{ verticalAlign: 'middle' }} /> Email</label>
            <div style={{ color: '#e2e8f0', fontSize: '1.05rem' }}>{user?.email}</div>
          </div>
          <div>
            <label style={labelStyle}><HiPhone style={{ verticalAlign: 'middle' }} /> Phone</label>
            {editing ? (
              <input style={inputStyle} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Enter phone number" />
            ) : (
              <div style={{ color: '#e2e8f0', fontSize: '1.05rem' }}>{user?.phone || 'Not provided'}</div>
            )}
          </div>
          <div>
            <label style={labelStyle}>Account Status</label>
            <span style={{ padding: '4px 14px', borderRadius: 20, background: user?.status === 'active' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: user?.status === 'active' ? '#34d399' : '#f87171', fontSize: '0.85rem', fontWeight: 600, textTransform: 'capitalize' }}>{user?.status}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
