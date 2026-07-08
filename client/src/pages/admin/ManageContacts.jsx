import { useState, useEffect } from 'react';
import { getMessages, replyMessage, deleteMessage } from '../../api/contactApi';
import { HiMail, HiTrash, HiReply } from 'react-icons/hi';

const ManageContacts = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data } = await getMessages();
      setMessages(data.contacts);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    try {
      await replyMessage(replyingTo, replyText);
      setReplyingTo(null);
      setReplyText('');
      fetchMessages();
      alert('Reply sent successfully!');
    } catch (error) {
      alert('Failed to send reply');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await deleteMessage(id);
        fetchMessages();
      } catch (error) {
        alert('Failed to delete message');
      }
    }
  };

  if (loading) return <div style={{ color: '#e2e8f0' }}>Loading messages...</div>;

  return (
    <div>
      <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#f8fafc', marginBottom: 24 }}>Manage Messages</h2>

      <div style={{ display: 'grid', gap: 20 }}>
        {messages.map((msg) => (
          <div key={msg._id} style={{
            background: 'rgba(255,255,255,0.03)',
            borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)',
            padding: 20
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <h3 style={{ color: '#f8fafc', fontSize: '1.2rem', margin: '0 0 4px 0' }}>{msg.subject || 'No Subject'}</h3>
                <div style={{ color: '#94a3b8', fontSize: '0.9rem', display: 'flex', gap: 16 }}>
                  <span><HiMail style={{ verticalAlign: 'text-bottom' }}/> {msg.name} ({msg.email})</span>
                  <span>{new Date(msg.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <span style={{
                  padding: '6px 12px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600,
                  background: msg.replied ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)',
                  color: msg.replied ? '#4ade80' : '#fbbf24',
                }}>
                  {msg.replied ? 'Replied' : 'Pending'}
                </span>
                <button
                  onClick={() => handleDelete(msg._id)}
                  style={{
                    background: 'rgba(239,68,68,0.1)', color: '#f87171',
                    border: 'none', padding: '6px 10px', borderRadius: 8, cursor: 'pointer',
                  }}
                ><HiTrash size={16}/></button>
              </div>
            </div>

            <p style={{ color: '#cbd5e1', lineHeight: 1.6, margin: '0 0 16px 0', padding: 16, background: 'rgba(0,0,0,0.2)', borderRadius: 8 }}>
              {msg.message}
            </p>

            {msg.replied ? (
              <div style={{ borderLeft: '4px solid #6366f1', paddingLeft: 16, marginLeft: 8 }}>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: 4 }}>Your Reply:</p>
                <p style={{ color: '#e2e8f0', margin: 0 }}>{msg.replyMessage}</p>
              </div>
            ) : (
              <div>
                {replyingTo === msg._id ? (
                  <form onSubmit={handleReply} style={{ marginTop: 16, display: 'flex', gap: 12 }}>
                    <input
                      type="text"
                      placeholder="Type your reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      required
                      style={{
                        flex: 1, padding: '10px 16px', background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', outline: 'none'
                      }}
                    />
                    <button type="submit" style={{
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      color: '#fff', border: 'none', padding: '0 20px', borderRadius: 8,
                      fontWeight: 600, cursor: 'pointer'
                    }}>Send</button>
                    <button type="button" onClick={() => setReplyingTo(null)} style={{
                      background: 'rgba(255,255,255,0.1)', color: '#fff',
                      border: 'none', padding: '0 20px', borderRadius: 8, cursor: 'pointer'
                    }}>Cancel</button>
                  </form>
                ) : (
                  <button onClick={() => setReplyingTo(msg._id)} style={{
                    background: 'rgba(99,102,241,0.1)', color: '#818cf8',
                    border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: '0.9rem'
                  }}>
                    <HiReply /> Reply
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
        {messages.length === 0 && (
          <div style={{ color: '#94a3b8', textAlign: 'center', padding: 40 }}>No messages found.</div>
        )}
      </div>
    </div>
  );
};

export default ManageContacts;
