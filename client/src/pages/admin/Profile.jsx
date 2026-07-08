import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../../api/adminApi';
import { HiUser, HiMail, HiPhone } from 'react-icons/hi';
import API from '../../api/axios';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    try {
      await updateUser(user._id, formData);
      setSuccessMsg('Profile updated successfully! Refreshing to apply changes...');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#f8fafc', marginBottom: 24 }}>My Profile</h2>
      
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: 16, padding: 32
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32 }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', fontWeight: 700, color: '#fff',
          }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.4rem' }}>{user?.name}</h3>
            <p style={{ margin: '4px 0 0 0', color: '#94a3b8' }}>Administrator</p>
          </div>
        </div>

        {successMsg && (
          <div style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399', padding: 12, borderRadius: 8, marginBottom: 20, fontSize: '0.9rem' }}>
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: '#94a3b8', fontSize: '0.9rem' }}>
              <HiUser /> Full Name
            </label>
            <input
              type="text" name="name"
              value={formData.name} onChange={handleChange}
              style={{
                width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', outline: 'none'
              }}
              required
            />
          </div>
          
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: '#94a3b8', fontSize: '0.9rem' }}>
              <HiMail /> Email Address
            </label>
            <input
              type="email" name="email"
              value={formData.email} onChange={handleChange}
              style={{
                width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', outline: 'none'
              }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: '#94a3b8', fontSize: '0.9rem' }}>
              <HiPhone /> Phone Number
            </label>
            <input
              type="text" name="phone"
              value={formData.phone} onChange={handleChange}
              style={{
                width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', outline: 'none'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 12,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff', border: 'none', padding: '14px', borderRadius: 10,
              fontSize: '1rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
