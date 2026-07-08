import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { HiMail } from 'react-icons/hi';
import toast, { Toaster } from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/forgotpassword', { email });
      toast.success(data.message || 'Email sent successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{ minHeight: 'calc(100vh - 72px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <Toaster position="top-right" />
      <div className="auth-card" style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', padding: 40, borderRadius: 24, width: '100%', maxWidth: 440 }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'Outfit', color: '#fff', marginBottom: 8, textAlign: 'center' }}>Forgot Password</h2>
        <p style={{ color: '#94a3b8', textAlign: 'center', marginBottom: 24, fontSize: '0.95rem' }}>Enter your email address and we'll send you a link to reset your password.</p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="input-group" style={{ position: 'relative' }}>
            <HiMail style={{ position: 'absolute', left: 16, top: 14, color: '#64748b', fontSize: '1.2rem' }} />
            <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: '12px 16px 12px 48px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#fff', outline: 'none' }} />
          </div>
          <button type="submit" disabled={loading} style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', padding: '14px', borderRadius: 12, border: 'none', fontWeight: 600, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 24, color: '#94a3b8', fontSize: '0.9rem' }}>
          Remembered your password? <Link to="/login" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: 500 }}>Login</Link>
        </p>
      </div>
    </div>
  );
};
export default ForgotPassword;
