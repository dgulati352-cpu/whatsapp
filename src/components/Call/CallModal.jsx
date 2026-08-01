import React, { useState } from 'react';
import { useWhatsApp } from '../../context/WhatsAppContext';
import { PhoneOff, Mic, MicOff, Video, VideoOff, Volume2 } from 'lucide-react';

export const CallModal = () => {
  const { activeCall, endCall } = useWhatsApp();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  if (!activeCall) return null;

  const { type, contact, status, seconds } = activeCall;

  const formatTimer = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="call-overlay">
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>
          {contact.name}
        </h2>
        <p style={{ fontSize: '15px', color: 'var(--accent)', fontWeight: 500 }}>
          {status === 'ringing' ? 'Ringing...' : status === 'connected' ? formatTimer(seconds) : 'Ending call...'}
        </p>
      </div>

      {type === 'video' && status === 'connected' && !isVideoOff ? (
        <div style={{
          width: '100%', maxWidth: '640px', height: '360px',
          backgroundColor: '#000', borderRadius: '16px', overflow: 'hidden',
          position: 'relative', boxShadow: 'var(--shadow-lg)'
        }}>
          {/* Main Remote Video Stream Mockup */}
          <img 
            src={contact.avatar} 
            alt={contact.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.9)' }}
          />
          {/* Self Camera Picture-in-Picture */}
          <div style={{
            position: 'absolute', bottom: 16, right: 16,
            width: 110, height: 140, borderRadius: '12px',
            overflow: 'hidden', border: '2px solid var(--accent)',
            boxShadow: 'var(--shadow-md)'
          }}>
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" 
              alt="You"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <img 
            src={contact.avatar} 
            alt={contact.name} 
            className="call-avatar" 
          />
          <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            WhatsApp End-to-End Encrypted {type === 'video' ? 'Video' : 'Audio'} Call
          </span>
        </div>
      )}

      {/* Control Buttons Bar */}
      <div className="call-controls">
        <button 
          className="call-btn mute" 
          onClick={() => setIsMuted(!isMuted)}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
        </button>

        {type === 'video' && (
          <button 
            className="call-btn mute" 
            onClick={() => setIsVideoOff(!isVideoOff)}
            title={isVideoOff ? 'Turn Camera On' : 'Turn Camera Off'}
          >
            {isVideoOff ? <VideoOff size={22} /> : <Video size={22} />}
          </button>
        )}

        <button 
          className="call-btn end" 
          onClick={endCall}
          title="End Call"
        >
          <PhoneOff size={24} />
        </button>
      </div>
    </div>
  );
};
