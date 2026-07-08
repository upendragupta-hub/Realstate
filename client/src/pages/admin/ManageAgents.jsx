import { useState, useEffect } from 'react';
import { getUsers, updateUser, deleteUser } from '../../api/adminApi';
import { HiUser, HiMail, HiPhone, HiBadgeCheck, HiBan, HiTrash, HiSearch } from 'react-icons/hi';
import { useSelector } from 'react-redux';

const ManageAgents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user: currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const { data } = await getUsers();
      setAgents(data.users.filter(u => u.role === 'agent'));
    } catch (error) {
      console.error('Error fetching agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (agent) => {
    try {
      const newStatus = agent.status === 'active' ? 'blocked' : 'active';
      await updateUser(agent._id, { status: newStatus });
      fetchAgents();
    } catch (error) {
      alert('Failed to update agent status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this agent?')) {
      try {
        await deleteUser(id);
        fetchAgents();
      } catch (error) {
        alert('Failed to delete agent');
      }
    }
  };

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div style={{ color: '#e2e8f0' }}>Loading agents...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#f8fafc' }}>Manage Agents</h2>
        <div style={{
          position: 'relative', width: 300,
        }}>
          <HiSearch style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: '1.2rem' }} />
          <input
            type="text"
            placeholder="Search agents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%', padding: '12px 16px 12px 42px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12, color: '#f8fafc', outline: 'none'
            }}
          />
        </div>
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.03)',
        borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ padding: '16px 20px', color: '#94a3b8', fontWeight: 600, fontSize: '0.9rem' }}>Agent</th>
              <th style={{ padding: '16px 20px', color: '#94a3b8', fontWeight: 600, fontSize: '0.9rem' }}>Contact</th>
              <th style={{ padding: '16px 20px', color: '#94a3b8', fontWeight: 600, fontSize: '0.9rem' }}>Status</th>
              <th style={{ padding: '16px 20px', color: '#94a3b8', fontWeight: 600, fontSize: '0.9rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAgents.map(agent => (
              <tr key={agent._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #f59e0b, #ea580c)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontWeight: 700
                    }}>
                      {agent.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ color: '#f8fafc', fontWeight: 600 }}>{agent.name}</div>
                      <div style={{ color: '#64748b', fontSize: '0.8rem' }}>Agent ID: {agent._id.slice(-6)}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ color: '#cbd5e1', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <HiMail style={{ color: '#94a3b8' }}/> {agent.email}
                  </div>
                  <div style={{ color: '#cbd5e1', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <HiPhone style={{ color: '#94a3b8' }}/> {agent.phone || 'N/A'}
                  </div>
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <span style={{
                    padding: '6px 12px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600,
                    background: agent.status === 'active' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                    color: agent.status === 'active' ? '#4ade80' : '#f87171',
                    display: 'inline-flex', alignItems: 'center', gap: 4
                  }}>
                    {agent.status === 'active' ? 'Active' : 'Blocked'}
                  </span>
                </td>
                <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                  {currentUser._id !== agent._id && (
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => handleStatusToggle(agent)}
                        style={{
                          background: agent.status === 'active' ? 'rgba(245,158,11,0.1)' : 'rgba(34,197,94,0.1)',
                          color: agent.status === 'active' ? '#fbbf24' : '#4ade80',
                          border: 'none', padding: '8px 12px', borderRadius: 8,
                          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: '0.85rem'
                        }}
                      >
                        {agent.status === 'active' ? <HiBan /> : <HiBadgeCheck />}
                        {agent.status === 'active' ? 'Block' : 'Unblock'}
                      </button>
                      <button
                        onClick={() => handleDelete(agent._id)}
                        style={{
                          background: 'rgba(239,68,68,0.1)', color: '#f87171',
                          border: 'none', padding: '8px 12px', borderRadius: 8,
                          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: '0.85rem'
                        }}
                      >
                        <HiTrash /> Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {filteredAgents.length === 0 && (
              <tr>
                <td colSpan="4" style={{ padding: '32px 20px', textAlign: 'center', color: '#94a3b8' }}>
                  No agents found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageAgents;
