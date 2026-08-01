import React, { useState, useRef, useEffect } from 'react';
import { useWhatsApp } from '../../context/WhatsAppContext';
import { 
  Phone, 
  Video, 
  Search, 
  MoreVertical, 
  Smile, 
  Paperclip, 
  Mic, 
  Send, 
  CheckCheck, 
  Check, 
  Play, 
  Pause, 
  FileText, 
  Image as ImageIcon, 
  X, 
  Trash2, 
  Star,
  Download
} from 'lucide-react';

export const ChatArea = () => {
  const { 
    activeContact, 
    activeMessages, 
    sendMessage, 
    isRecording, 
    recordingTime, 
    startRecording, 
    stopAndSendRecording, 
    cancelRecording,
    startCall,
    setMediaPreview,
    currentWallpaper,
    wallpapersList
  } = useWhatsApp();

  const [inputVal, setInputVal] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages]);

  if (!activeContact) {
    return (
      <main className="chat-area">
        <div className="empty-chat-state">
          <div style={{
            width: 120, height: 120, borderRadius: '50%',
            backgroundColor: 'var(--accent-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '20px'
          }}>
            <span style={{ fontSize: '48px' }}>💬</span>
          </div>
          <h2 className="empty-chat-title">WhatsApp Web Clone</h2>
          <p className="empty-chat-desc">
            Send and receive messages seamlessly. Select a chat from the sidebar or click New Chat to start a conversation.
          </p>
        </div>
      </main>
    );
  }

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputVal.trim()) return;
    sendMessage(inputVal, 'text');
    setInputVal('');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isImg = file.type.startsWith('image/');
    const fileUrl = URL.createObjectURL(file);

    if (isImg) {
      sendMessage('', 'image', {
        imageUrl: fileUrl,
        caption: file.name
      });
    } else {
      sendMessage('', 'document', {
        docName: file.name,
        docSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      });
    }
    setShowAttachMenu(false);
  };

  const togglePlayAudio = (msgId) => {
    if (playingAudioId === msgId) {
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(msgId);
    }
  };

  // Find background style for selected wallpaper
  const wallpaperObj = wallpapersList.find(w => w.id === currentWallpaper) || wallpapersList[0];

  return (
    <main className="chat-area" style={{ background: wallpaperObj.bg }}>
      {/* Chat Header */}
      <header className="chat-header">
        <div className="chat-header-info">
          <img 
            src={activeContact.avatar} 
            alt={activeContact.name} 
            className="chat-header-avatar" 
          />
          <div className="chat-header-details">
            <span className="chat-header-title">{activeContact.name}</span>
            <span className="chat-header-subtitle">
              {activeContact.typing ? (
                <span style={{ color: 'var(--accent)', fontWeight: 600 }}>typing...</span>
              ) : activeContact.online ? (
                'Online'
              ) : (
                `Last seen ${activeContact.lastSeen}`
              )}
            </span>
          </div>
        </div>

        <div className="chat-header-actions">
          {/* Video Call Button */}
          <button 
            className="icon-btn"
            onClick={() => startCall('video', activeContact)}
            title="Video Call"
          >
            <Video size={20} />
          </button>

          {/* Voice Call Button */}
          <button 
            className="icon-btn"
            onClick={() => startCall('audio', activeContact)}
            title="Audio Call"
          >
            <Phone size={20} />
          </button>

          <button className="icon-btn" title="Search in chat">
            <Search size={20} />
          </button>
        </div>
      </header>

      {/* Message Feed */}
      <div className="messages-container">
        <div className="date-divider">Today</div>

        {activeMessages.map((msg) => {
          const isMe = msg.senderId === 'user_me';

          return (
            <div 
              key={msg.id} 
              className={`message-bubble ${isMe ? 'outgoing' : 'incoming'}`}
            >
              {/* Group message sender name */}
              {activeContact.isGroup && !isMe && (
                <span className="sender-name-label">{msg.senderName}</span>
              )}

              {/* Text Message */}
              {msg.type === 'text' && (
                <div>{msg.text}</div>
              )}

              {/* Image Message */}
              {msg.type === 'image' && (
                <div>
                  <img 
                    src={msg.imageUrl} 
                    alt="Shared Media" 
                    className="message-image"
                    onClick={() => setMediaPreview({ type: 'image', url: msg.imageUrl, caption: msg.caption })}
                  />
                  {msg.caption && <p style={{ fontSize: '13.5px', marginTop: '4px' }}>{msg.caption}</p>}
                </div>
              )}

              {/* Voice Note Message */}
              {msg.type === 'audio' && (
                <div className="voice-note-player">
                  <button 
                    onClick={() => togglePlayAudio(msg.id)}
                    style={{
                      width: 36, height: 36, borderRadius: '50%',
                      backgroundColor: 'var(--accent)', border: 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#111b21', cursor: 'pointer'
                    }}
                  >
                    {playingAudioId === msg.id ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: 2 }} />}
                  </button>

                  <div className="wave-bars">
                    {(msg.waves || [20, 50, 80, 40, 60, 90, 30, 70, 40, 80]).map((h, idx) => (
                      <div 
                        key={idx} 
                        className={`wave-bar ${playingAudioId === msg.id && idx < 5 ? 'active' : ''}`}
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{msg.duration}</span>
                    <button 
                      onClick={() => setPlaybackSpeed(s => s === 1 ? 1.5 : s === 1.5 ? 2 : 1)}
                      style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '10px', cursor: 'pointer', fontWeight: 600 }}
                    >
                      {playbackSpeed}x
                    </button>
                  </div>
                </div>
              )}

              {/* Document Message */}
              {msg.type === 'document' && (
                <div className="document-card">
                  <FileText size={28} style={{ color: 'var(--accent)' }} />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '14px', fontWeight: 500 }}>{msg.docName}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{msg.docSize}</span>
                  </div>
                  <Download size={18} style={{ color: 'var(--text-secondary)', marginLeft: 'auto', cursor: 'pointer' }} />
                </div>
              )}

              {/* Footer Timestamp & Status Ticks */}
              <div className="message-footer">
                <span>{msg.timestamp}</span>
                {isMe && (
                  msg.status === 'read' ? (
                    <CheckCheck size={15} style={{ color: 'var(--tick-read)' }} />
                  ) : (
                    <Check size={15} style={{ color: 'var(--tick-unread)' }} />
                  )
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Attachment Menu Popup */}
      {showAttachMenu && (
        <div 
          style={{
            position: 'absolute',
            bottom: '75px',
            left: '60px',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            boxShadow: 'var(--shadow-lg)',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            zIndex: 40
          }}
        >
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '14px' }}>
            <ImageIcon size={18} style={{ color: '#00a884' }} /> Photos & Videos
            <input type="file" accept="image/*,video/*" hidden onChange={handleFileUpload} />
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '14px' }}>
            <FileText size={18} style={{ color: '#53bdeb' }} /> Document
            <input type="file" accept=".pdf,.doc,.docx,.txt" hidden onChange={handleFileUpload} />
          </label>
        </div>
      )}

      {/* Input Bar */}
      <footer className="chat-input-bar">
        {isRecording ? (
          <div className="recording-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="recording-pulse" />
              <span>Recording Voice Note... ({recordingTime}s)</span>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="icon-btn" onClick={cancelRecording} title="Cancel">
                <Trash2 size={20} style={{ color: '#ea4335' }} />
              </button>
              <button className="send-btn" onClick={stopAndSendRecording} title="Send Voice Note">
                <Send size={18} />
              </button>
            </div>
          </div>
        ) : (
          <>
            <button className="icon-btn" title="Emoji">
              <Smile size={22} />
            </button>

            <button 
              className="icon-btn" 
              onClick={() => setShowAttachMenu(!showAttachMenu)}
              title="Attach File"
            >
              <Paperclip size={22} />
            </button>

            <form onSubmit={handleSend} style={{ flex: 1, display: 'flex' }}>
              <input 
                type="text" 
                className="text-input-field" 
                placeholder="Type a message..." 
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
              />
            </form>

            {inputVal.trim() ? (
              <button className="send-btn" onClick={handleSend} title="Send Message">
                <Send size={18} />
              </button>
            ) : (
              <button className="send-btn" onClick={startRecording} title="Record Voice Note">
                <Mic size={18} />
              </button>
            )}
          </>
        )}
      </footer>
    </main>
  );
};
