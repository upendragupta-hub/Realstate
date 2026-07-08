import { useState } from 'react';
import API from '../../api/axios';
import toast, { Toaster } from 'react-hot-toast';
import { HiLockClosed, HiKey } from 'react-icons/hi';

const ChangePassword = () => {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      return toast.error('New passwords do not match');
    }
    if (form.newPassword.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    setLoading(true);
    try {
      const { data } = await API.put('/auth/changepassword', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      localStorage.setItem('realstate_token', data.token);
      toast.success('Password changed successfully!');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px 12px 48px', background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff',
    outline: 'none', fontSize: '0.95rem',
  };

  return (
    <div>
      <Toaster position="top-right" />
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f1f5f9', marginBottom: 24, fontFamily: 'Outfit', display: 'flex', alignItems: 'center', gap: 12 }}>
        <HiKey style={{ color: '#f59e0b' }} /> Change Password
      </h1>

      <div style={{ maxWidth: 480, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 32 }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase' }}>Current Password</label>
            <div style={{ position: 'relative' }}>
              <HiLockClosed style={{ position: 'absolute', left: 16, top: 14, color: '#64748b', fontSize: '1.1rem' }} />
              <input type="password" style={inputStyle} value={form.currentPassword} onChange={e => setForm({ ...form, currentPassword: e.target.value })} required placeholder="Enter current password" />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase' }}>New Password</label>
            <div style={{ position: 'relative' }}>
              <HiLockClosed style={{ position: 'absolute', left: 16, top: 14, color: '#64748b', fontSize: '1.1rem' }} />
              <input type="password" style={inputStyle} value={form.newPassword} onChange={e => setForm({ ...form, newPassword: e.target.value })} required minLength={6} placeholder="Min 6 characters" />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase' }}>Confirm New Password</label>
            <div style={{ position: 'relative' }}>
              <HiLockClosed style={{ position: 'absolute', left: 16, top: 14, color: '#64748b', fontSize: '1.1rem' }} />
              <input type="password" style={inputStyle} value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} required placeholder="Re-enter new password" />
            </div>
          </div>
          <button type="submit" disabled={loading} style={{ padding: '14px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 700, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: 8 }}>
            {loading ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
