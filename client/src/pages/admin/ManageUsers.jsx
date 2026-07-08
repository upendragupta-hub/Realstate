import { useState, useEffect } from 'react';
import { getUsers, deleteUser } from '../../api/adminApi';
import { HiTrash, HiUsers } from 'react-icons/hi';
import toast, { Toaster } from 'react-hot-toast';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const { data } = await getUsers();
      setUsers(data.users);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"?`)) return;
    try {
      await deleteUser(id);
      toast.success('User deleted');
      fetchUsers();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to delete'); }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><div className="loader"></div></div>;

  return (
    <div>
      <Toaster position="top-right" />
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Outfit', color: '#f1f5f9' }}>Manage Users</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{users.length} total users</p>
      </div>

      <div className="table-container">
        <table>
          <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td style={{ fontWeight: 600 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: u.role === 'admin' ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'linear-gradient(135deg,#475569,#64748b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                      {u.name?.[0]?.toUpperCase()}
                    </div>
                    {u.name}
                  </div>
                </td>
                <td>{u.email}</td>
                <td>{u.phone || '-'}</td>
                <td><span className={`badge badge-${u.role}`}>{u.role}</span></td>
                <td>
                  <span style={{
                    padding: '4px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600,
                    background: u.status === 'active' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                    color: u.status === 'active' ? '#4ade80' : '#f87171'
                  }}>
                    {u.status === 'active' ? 'Active' : 'Blocked'}
                  </span>
                </td>
                <td>
                  {u.role !== 'admin' ? (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button 
                        onClick={async () => {
                          try {
                            await import('../../api/adminApi').then(m => m.updateUser(u._id, { status: u.status === 'active' ? 'blocked' : 'active' }));
                            fetchUsers();
                          } catch (e) { toast.error('Failed to update status'); }
                        }}
                        style={{
                          background: u.status === 'active' ? 'rgba(245,158,11,0.1)' : 'rgba(34,197,94,0.1)',
                          color: u.status === 'active' ? '#fbbf24' : '#4ade80',
                          border: 'none', padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem'
                        }}
                      >
                        {u.status === 'active' ? 'Block' : 'Unblock'}
                      </button>
                      <button className="btn-danger" style={{ padding: '6px 12px' }} onClick={() => handleDelete(u._id, u.name)}>
                        <HiTrash />
                      </button>
                    </div>
                  ) : (
                    <span style={{ color: '#64748b', fontSize: '0.8rem' }}>Protected</span>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', color: '#64748b', padding: 40 }}>No users found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
