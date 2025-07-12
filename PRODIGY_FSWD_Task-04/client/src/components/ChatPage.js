import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { EMOJIS } from '../emoji-list';

const socket = io('http://localhost:5000');

function ChatPage({ user, token }) {
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [notification, setNotification] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Fetch user's rooms
    axios.get('http://localhost:5000/api/rooms/my', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setRooms(res.data));
  }, [token]);

  useEffect(() => {
    if (!currentRoom) return;
    // Fetch room messages
    axios.get(`http://localhost:5000/api/rooms/${currentRoom._id}/messages`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setMessages(res.data));
    socket.emit('joinRoom', { roomId: currentRoom._id, username: user.username });
    return () => socket.emit('leaveRoom', { roomId: currentRoom._id, username: user.username });
  }, [currentRoom, token, user.username]);

  useEffect(() => {
    socket.on('message', msg => {
      setMessages(prev => [...prev, msg]);
    });
    socket.on('notification', note => {
      let n;
      try {
        n = JSON.parse(note);
      } catch {
        n = { type: 'info', content: note };
      }
      setNotification(n.content);
      // Browser notification for messages
      if (n.type === 'message' && window.Notification && Notification.permission === 'granted') {
        new Notification('New Message', { body: n.content });
      }
      setTimeout(() => setNotification(''), 3000);
    });
    socket.on('presence', users => {
      setOnlineUsers(users);
    });
    return () => {
      socket.off('message');
      socket.off('notification');
      socket.off('presence');
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (file) {
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        setFilePreview(URL.createObjectURL(file));
      } else {
        setFilePreview(null);
      }
    } else {
      setFilePreview(null);
    }
  }, [file]);

  const handleSend = async e => {
    e.preventDefault();
    if (!input.trim() && !file) return;
    if (!currentRoom) return;
    let fileUrl = null;
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      setUploading(true);
      try {
        const res = await axios.post('http://localhost:5000/api/upload', formData, {
          headers: { Authorization: `Bearer ${token}` },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setNotification(`Uploading: ${percent}%`);
          }
        });
        fileUrl = res.data.fileUrl;
      } catch (err) {
        alert('File upload failed');
        setUploading(false);
        return;
      }
      setUploading(false);
      setNotification('');
    }
    socket.emit('chatMessage', {
      roomId: currentRoom._id,
      userId: user.id,
      content: input,
      fileUrl
    });
    setInput('');
    setFile(null);
  };

  const handleCreateRoom = async () => {
    const name = prompt('Enter room name:');
    if (!name) return;
    try {
      const res = await axios.post('http://localhost:5000/api/rooms/create', { name }, { headers: { Authorization: `Bearer ${token}` } });
      setRooms(prev => [...prev, res.data]);
    } catch (err) {
      alert(err.response?.data?.msg || 'Error creating room');
    }
  };

  const handleJoinRoom = async () => {
    const name = prompt('Enter room name to join:');
    if (!name) return;
    try {
      const res = await axios.post('http://localhost:5000/api/rooms/join', { name }, { headers: { Authorization: `Bearer ${token}` } });
      setRooms(prev => [...prev, res.data]);
    } catch (err) {
      alert(err.response?.data?.msg || 'Error joining room');
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'linear-gradient(135deg, #f0f4f9 0%, #e9eafc 100%)' }}>
      {/* Sidebar */}
      <div style={{ width: 290, background: '#fff', borderRight: '1px solid #e3e6f3', padding: '24px 18px 18px 18px', display: 'flex', flexDirection: 'column', boxShadow: '2px 0 12px #e3e6f3', zIndex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 22, color: '#2e3b55', marginBottom: 18, letterSpacing: 1 }}>💬 Chatify</div>
        <div style={{ fontWeight: 600, fontSize: 15, color: '#4b566b', marginBottom: 12 }}>Rooms</div>
        <button onClick={handleCreateRoom} style={{ width: '100%', marginBottom: 7, padding: '9px 0', borderRadius: 7, background: 'linear-gradient(90deg,#667eea 0%,#5a67d8 100%)', color: '#fff', fontWeight: 500, border: 'none', cursor: 'pointer', fontSize: 15, boxShadow: '0 1px 6px #e3e6f3', transition: 'background 0.2s' }}>+ Create Room</button>
        <button onClick={handleJoinRoom} style={{ width: '100%', marginBottom: 16, padding: '9px 0', borderRadius: 7, background: 'none', border: '1px solid #667eea', color: '#667eea', fontWeight: 500, cursor: 'pointer', fontSize: 15, boxShadow: '0 1px 6px #e3e6f3', transition: 'background 0.2s' }}>+ Join Room</button>
        <div style={{ flex: 1, overflowY: 'auto', marginBottom: 16 }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {rooms.map(room => (
              <li key={room._id} style={{ margin: '8px 0' }}>
                <button onClick={() => setCurrentRoom(room)} style={{ width: '100%', background: currentRoom?._id === room._id ? 'linear-gradient(90deg,#667eea22 0%,#5a67d822 100%)' : '#f7f9fa', color: currentRoom?._id === room._id ? '#5a67d8' : '#2e3b55', border: 'none', borderRadius: 7, padding: '8px', fontWeight: 500, fontSize: 15, cursor: 'pointer', textAlign: 'left', transition: 'background 0.2s' }}>{room.name}</button>
              </li>
            ))}
          </ul>
        </div>
        <div style={{ borderTop: '1px solid #e3e6f3', margin: '0 -18px 0 -18px', padding: '18px 0 0 0' }}>
          <div style={{ fontWeight: 600, fontSize: 15, color: '#4b566b', marginBottom: 8 }}>Online</div>
          <ul style={{ listStyle: 'none', padding: 0, color: '#388e3c', fontWeight: 500, fontSize: 14, margin: 0 }}>
            {onlineUsers.map(name => (
              <li key={name} style={{ margin: '4px 0' }}>● {name}</li>
            ))}
          </ul>
        </div>
      </div>
      {/* Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'none', minWidth: 0 }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '36px 0 18px 0', background: 'none', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {currentRoom ? (
            <>
              <div style={{ fontWeight: 600, fontSize: 20, color: '#2e3b55', marginLeft: 32, marginBottom: 16 }}>{currentRoom.name}</div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '0 32px' }}>
                {messages.map((msg, idx) => (
                  <div key={msg._id || idx} style={{
                    margin: '12px 0',
                    display: 'flex',
                    flexDirection: msg.sender?.username === user.username ? 'row-reverse' : 'row',
                    alignItems: 'flex-end'
                  }}>
                    <div style={{
                      background: msg.sender?.username === user.username ? 'linear-gradient(90deg,#667eea 0%,#5a67d8 100%)' : '#fff',
                      color: msg.sender?.username === user.username ? '#fff' : '#2e3b55',
                      borderRadius: 16,
                      padding: msg.fileUrl ? '10px 16px 12px 16px' : '10px 16px',
                      boxShadow: '0 1px 8px #e3e6f3',
                      minWidth: 60,
                      maxWidth: '60%',
                      wordBreak: 'break-word',
                      position: 'relative'
                    }}>
                      <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 2 }}>{msg.sender?.username || 'User'}</div>
                      {msg.content && <div style={{ fontSize: 16 }}>{msg.content}</div>}
                      {msg.fileUrl && (
                        <div style={{ marginTop: 8 }}>
                          {msg.fileUrl.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                            <img src={`http://localhost:5000${msg.fileUrl}`} alt="file" style={{ maxWidth: 180, maxHeight: 180, borderRadius: 10, boxShadow: '0 1px 4px #e3e6f3', margin: '6px 0' }} />
                          ) : (
                            <a href={`http://localhost:5000${msg.fileUrl}`} target="_blank" rel="noopener noreferrer" style={{ color: '#5a67d8', textDecoration: 'underline', fontWeight: 500 }}>Download File</a>
                          )}
                        </div>
                      )}
                      <div style={{ fontSize: 12, color: msg.sender?.username === user.username ? '#e0e7ff' : '#888', marginTop: 6 }}>{new Date(msg.createdAt).toLocaleTimeString()}</div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </>
          ) : <div style={{ color: '#888', fontSize: 16, marginLeft: 32 }}>Select or join a room to start chatting.</div>}
        </div>
      {notification && <div style={{ background: '#ffe082', padding: 12, fontWeight: 500, color: '#7b5e00', textAlign: 'center', fontSize: 15 }}>{notification}</div>}
      <form onSubmit={handleSend} style={{ display: 'flex', padding: '18px 32px', borderTop: '1px solid #e3e6f3', alignItems: 'center', background: '#fff', gap: 10 }}>
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message..." style={{ flex: 1, marginRight: 8, padding: '12px 16px', borderRadius: 8, border: '1px solid #dbe2ef', fontSize: 16, outline: 'none', background: '#f7f9fa' }} />
        <input type="file" onChange={e => setFile(e.target.files[0])} style={{ marginRight: 8 }} />
        {filePreview && (
          <div style={{ marginRight: 8 }}>
            {file && file.type.startsWith('image/') && (
              <img src={filePreview} alt="preview" style={{ maxWidth: 60, maxHeight: 60, borderRadius: 6, boxShadow: '0 1px 4px #e3e6f3' }} />
            )}
            {file && file.type.startsWith('video/') && (
              <video src={filePreview} style={{ maxWidth: 60, maxHeight: 60, borderRadius: 6 }} controls />
            )}
            <button type="button" onClick={() => { setFile(null); setFilePreview(null); }} style={{ display: 'block', marginTop: 4, fontSize: 12, color: '#c00', background: 'none', border: 'none', cursor: 'pointer' }}>Remove</button>
          </div>
        )}
        <button type="submit" disabled={uploading} style={{ background: uploading ? '#bbb' : 'linear-gradient(90deg,#667eea 0%,#5a67d8 100%)', color: '#fff', fontWeight: 600, border: 'none', padding: '12px 24px', borderRadius: 8, fontSize: 16, cursor: uploading ? 'not-allowed' : 'pointer', boxShadow: '0 1px 6px #e3e6f3', transition: 'background 0.2s' }}>{uploading ? 'Uploading...' : 'Send'}</button>
      </form>
    </div>
  </div>
);
}
export default ChatPage;
