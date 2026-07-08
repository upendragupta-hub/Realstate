import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadUser } from '../../store/authSlice';
import API from '../../api/axios';
import toast, { Toaster } from 'react-hot-toast';
import { HiUser, HiPencil, HiCheck, HiX, HiShieldCheck } from 'react-icons/hi';

const AgentProfile = () => {
  const { user } = useSelector(state => state.auth);
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
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to update'); }
    finally { setLoading(false); }
  };

  const inp = { width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', outline: 'none', fontSize: '0.95rem' };
  const lbl = { display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase' };

  return (
    <div>
      <Toaster position="top-right" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f1f5f9', fontFamily: 'Outfit' }}>Agent Profile</h1>
        {!editing ? (
          <button onClick={() => setEditing(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: 'linear-gradient(135deg,#10b981,#3b82f6)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 600, cursor: 'pointer' }}><HiPencil /> Edit</button>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleSave} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', background: '#10b981', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 600, cursor: 'pointer' }}><HiCheck /> Save</button>
            <button onClick={() => setEditing(false)} style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#94a3b8', cursor: 'pointer' }}><HiX /> Cancel</button>
          </div>
        )}
      </div>
      <div style={{ maxWidth: 600, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28, paddingBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,#10b981,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 800, color: '#fff' }}>{user?.name?.[0]?.toUpperCase()}</div>
          <div>
            <h2 style={{ fontSize: '1.4rem', color: '#fff', margin: 0 }}>{user?.name}</h2>
            <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
              <span style={{ padding: '2px 10px', borderRadius: 20, background: 'rgba(16,185,129,0.15)', color: '#34d399', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Agent</span>
              {user?.isEmailVerified && <span style={{ padding: '2px 10px', borderRadius: 20, background: 'rgba(6,182,212,0.15)', color: '#22d3ee', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}><HiShieldCheck /> Verified</span>}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div><label style={lbl}>Name</label>{editing ? <input style={inp} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /> : <div style={{ color: '#e2e8f0' }}>{user?.name}</div>}</div>
          <div><label style={lbl}>Email</label><div style={{ color: '#e2e8f0' }}>{user?.email}</div></div>
          <div><label style={lbl}>Phone</label>{editing ? <input style={inp} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /> : <div style={{ color: '#e2e8f0' }}>{user?.phone || 'Not set'}</div>}</div>
        </div>
      </div>
    </div>
  );
};
export default AgentProfile;
