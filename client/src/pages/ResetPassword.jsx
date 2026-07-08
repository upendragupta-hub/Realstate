import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { HiLockClosed } from 'react-icons/hi';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { loadUser } from '../store/authSlice';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.put(`/api/auth/resetpassword/${token}`, { password });
      toast.success('Password reset successfully!');
      localStorage.setItem('token', data.token);
      dispatch(loadUser());
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired token');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{ minHeight: 'calc(100vh - 72px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <Toaster position="top-right" />
      <div className="auth-card" style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', padding: 40, borderRadius: 24, width: '100%', maxWidth: 440 }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'Outfit', color: '#fff', marginBottom: 8, textAlign: 'center' }}>Reset Password</h2>
        <p style={{ color: '#94a3b8', textAlign: 'center', marginBottom: 24, fontSize: '0.95rem' }}>Enter your new password below.</p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="input-group" style={{ position: 'relative' }}>
            <HiLockClosed style={{ position: 'absolute', left: 16, top: 14, color: '#64748b', fontSize: '1.2rem' }} />
            <input type="password" placeholder="New Password (min 6 chars)" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} style={{ width: '100%', padding: '12px 16px 12px 48px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#fff', outline: 'none' }} />
          </div>
          <button type="submit" disabled={loading} style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', padding: '14px', borderRadius: 12, border: 'none', fontWeight: 600, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};
export default ResetPassword;
