import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getChats } from '../../api/chatApi';
import ChatWindow from '../../components/ChatWindow';

const AgentMessages = () => {
  const { user } = useSelector((s) => s.auth);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getChats();
        setChats(data.chats);
        if (data.chats.length > 0) {
          setActiveChat(data.chats[0]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div style={{ height: 'calc(100vh - 120px)', display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24 }}>
      {/* Sidebar - Chat List */}
      <div className="glass" style={{ overflowY: 'auto' }}>
        <h3 style={{ padding: 20, margin: 0, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Messages</h3>
        {loading ? (
          <div style={{ padding: 20, textAlign: 'center', color: '#94a3b8' }}>Loading...</div>
        ) : chats.length === 0 ? (
          <div style={{ padding: 20, textAlign: 'center', color: '#94a3b8' }}>No conversations yet</div>
        ) : (
          chats.map((chat) => (
            <div 
              key={chat._id} 
              onClick={() => setActiveChat(chat)}
              style={{ 
                padding: 16, cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.06)',
                background: activeChat?._id === chat._id ? 'rgba(255,255,255,0.05)' : 'transparent',
                transition: 'background 0.2s'
              }}
            >
              <div style={{ fontWeight: 600, color: '#f1f5f9' }}>{chat.buyer?.name}</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{chat.property?.title}</div>
            </div>
          ))
        )}
      </div>

      {/* Main - Chat Window */}
      <div className="glass">
        <ChatWindow activeChat={activeChat} currentUser={user} />
      </div>
    </div>
  );
};

export default AgentMessages;
