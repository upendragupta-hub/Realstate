import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../store/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { HiUser, HiMail, HiLockClosed, HiArrowRight } from 'react-icons/hi';
import toast, { Toaster } from 'react-hot-toast';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [role, setRole] = useState('user');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isAuthenticated, error } = useSelector((s) => s.auth);

  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearError()); }
  }, [error, dispatch]);

  if (isAuthenticated) {
    return (
      <div style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div className="glass animate-scale-in" style={{ padding: 40, textAlign: 'center', maxWidth: 400 }}>
          <h2 style={{ color: '#f1f5f9', marginBottom: 16 }}>You are already logged in!</h2>
          <p style={{ color: '#94a3b8', marginBottom: 24 }}>Please logout first if you want to create a new account.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link to="/dashboard" className="btn-primary">Go to Dashboard</Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPass) return toast.error('Passwords do not match');
    if (password.length < 6) return toast.error('Password must be at least 6 characters');
    dispatch(registerUser({ name, email, password, role }));
  };

  return (
    <div style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative', overflow: 'hidden' }}>
      <Toaster position="top-right" />
      <div style={{ position: 'absolute', top: '15%', right: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <div style={{ position: 'absolute', bottom: '15%', left: '10%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)', filter: 'blur(60px)' }} />

      <div className="glass animate-scale-in" style={{ width: '100%', maxWidth: 440, padding: '40px 36px', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, color: '#fff', margin: '0 auto 16px' }}>R</div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'Outfit', color: '#f1f5f9', marginBottom: 6 }}>Create Account</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Join Realstate today</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.85rem', fontWeight: 500, marginBottom: 6 }}>Full Name</label>
            <div style={{ position: 'relative' }}>
              <HiUser style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input className="input-field" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required style={{ paddingLeft: 40 }} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.85rem', fontWeight: 500, marginBottom: 6 }}>Email</label>
            <div style={{ position: 'relative' }}>
              <HiMail style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input className="input-field" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required style={{ paddingLeft: 40 }} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.85rem', fontWeight: 500, marginBottom: 6 }}>Account Type</label>
            <select className="input-field" value={role} onChange={e => setRole(e.target.value)} style={{ paddingLeft: 16 }}>
              <option value="user">Regular User (Buyer/Tenant)</option>
              <option value="agent">Agent (Seller/Broker)</option>
              <option value="admin">Admin (System Administrator)</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.85rem', fontWeight: 500, marginBottom: 6 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <HiLockClosed style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input className="input-field" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required style={{ paddingLeft: 40 }} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.85rem', fontWeight: 500, marginBottom: 6 }}>Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <HiLockClosed style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input className="input-field" type="password" placeholder="••••••••" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} required style={{ paddingLeft: 40 }} />
            </div>
          </div>
          <button type="submit" className="btn-primary" disabled={isLoading} style={{ width: '100%', justifyContent: 'center', marginTop: 8, padding: '14px 28px' }}>
            {isLoading ? 'Creating account...' : 'Register'} {!isLoading && <HiArrowRight />}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem', marginTop: 24 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: 600 }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
