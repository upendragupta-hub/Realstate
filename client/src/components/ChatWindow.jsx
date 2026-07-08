import { useState, useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import { getMessages, sendMessage } from '../api/chatApi';
import { HiPaperAirplane } from 'react-icons/hi';

const ChatWindow = ({ activeChat, currentUser }) => {
  const socket = useSocket();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!activeChat) return;
    fetchMessages();

    if (socket) {
      socket.emit('join_chat', activeChat._id);
      socket.on('message_received', (message) => {
        if (message.chatId === activeChat._id) {
          setMessages((prev) => [...prev, message]);
        }
      });
    }

    return () => {
      if (socket) socket.off('message_received');
    };
  }, [activeChat, socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data } = await getMessages(activeChat._id);
      setMessages(data.messages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const { data } = await sendMessage(activeChat._id, newMessage);
      setMessages((prev) => [...prev, data.message]);
      setNewMessage('');
      if (socket) {
        socket.emit('new_message', data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!activeChat) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>
        Select a chat to start messaging
      </div>
    );
  }

  // Determine the other person by comparing IDs, not roles
  const isBuyer = activeChat.buyer?._id === currentUser._id;
  const otherUser = isBuyer ? activeChat.agent : activeChat.buyer;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'rgba(255,255,255,0.02)', borderRadius: 16, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '16px 24px', background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>
          {otherUser?.name?.[0]?.toUpperCase()}
        </div>
        <div>
          <h4 style={{ margin: 0, color: '#f1f5f9' }}>{otherUser?.name}</h4>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>{activeChat.property?.title}</p>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, padding: 24, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: '#94a3b8' }}>Loading messages...</div>
        ) : (
          messages.map((m, i) => {
            const isMe = m.sender._id === currentUser._id || m.sender === currentUser._id;
            return (
              <div key={i} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '70%', padding: '10px 16px', borderRadius: 16,
                  borderBottomRightRadius: isMe ? 4 : 16, borderBottomLeftRadius: !isMe ? 4 : 16,
                  background: isMe ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.08)',
                  color: '#fff', fontSize: '0.95rem'
                }}>
                  {m.text}
                  <div style={{ fontSize: '0.65rem', textAlign: 'right', marginTop: 4, opacity: 0.7 }}>
                    {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} style={{ padding: 16, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 12 }}>
        <input 
          value={newMessage} 
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: 1, padding: '12px 16px', borderRadius: 24, border: 'none', background: 'rgba(255,255,255,0.05)', color: '#fff', outline: 'none' }}
        />
        <button type="submit" style={{ width: 44, height: 44, borderRadius: '50%', background: '#6366f1', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <HiPaperAirplane style={{ transform: 'rotate(90deg)' }} />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
