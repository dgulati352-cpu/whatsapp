import React, { useState, useEffect } from 'react';
import { useWhatsApp } from '../../context/WhatsAppContext';
import { X, ChevronLeft, ChevronRight, Plus, Send } from 'lucide-react';

export const StatusView = ({ onClose }) => {
  const { statuses, addNewStatus } = useWhatsApp();
  const [currentUserIdx, setCurrentUserIdx] = useState(0);
  const [currentItemIdx, setCurrentItemIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isAddingStatus, setIsAddingStatus] = useState(false);
  const [newStatusText, setNewStatusText] = useState('');

  const activeUserStatus = statuses[currentUserIdx] || statuses[0];
  const activeItem = activeUserStatus?.items[currentItemIdx] || activeUserStatus?.items[0];

  useEffect(() => {
    if (isAddingStatus) return;

    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNextItem();
          return 0;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentUserIdx, currentItemIdx, isAddingStatus]);

  const handleNextItem = () => {
    if (currentItemIdx < activeUserStatus.items.length - 1) {
      setCurrentItemIdx(currentItemIdx + 1);
    } else if (currentUserIdx < statuses.length - 1) {
      setCurrentUserIdx(currentUserIdx + 1);
      setCurrentItemIdx(0);
    } else {
      onClose();
    }
  };

  const handlePrevItem = () => {
    if (currentItemIdx > 0) {
      setCurrentItemIdx(currentItemIdx - 1);
    } else if (currentUserIdx > 0) {
      setCurrentUserIdx(currentUserIdx - 1);
      setCurrentItemIdx(0);
    }
  };

  const handleCreateStatus = (e) => {
    e.preventDefault();
    if (!newStatusText.trim()) return;
    addNewStatus(newStatusText);
    setNewStatusText('');
    setIsAddingStatus(false);
  };

  return (
    <div className="status-modal">
      <button 
        onClick={onClose}
        style={{
          position: 'absolute', top: 20, right: 20,
          background: 'none', border: 'none', color: '#fff',
          cursor: 'pointer', zIndex: 110
        }}
      >
        <X size={28} />
      </button>

      <div className="status-card">
        {/* Top Progress Tracks */}
        <div className="status-progress-bar">
          {activeUserStatus.items.map((_, idx) => (
            <div key={idx} className="progress-track">
              <div 
                className="progress-fill" 
                style={{
                  width: idx < currentItemIdx ? '100%' : idx === currentItemIdx ? `${progress}%` : '0%'
                }}
              />
            </div>
          ))}
        </div>

        {/* User Info Header */}
        <div style={{
          position: 'absolute', top: 24, left: 16, right: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          zIndex: 15, color: '#fff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img 
              src={activeUserStatus.userAvatar} 
              alt={activeUserStatus.userName}
              style={{ width: 42, height: 42, borderRadius: '50%', border: '2px solid var(--accent)' }}
            />
            <div>
              <div style={{ fontWeight: 600, fontSize: '15px' }}>{activeUserStatus.userName}</div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>{activeItem?.timestamp || activeUserStatus.time}</div>
            </div>
          </div>

          {activeUserStatus.userId === 'user_me' && (
            <button 
              onClick={() => setIsAddingStatus(true)}
              style={{
                backgroundColor: 'var(--accent)', color: '#111b21',
                border: 'none', borderRadius: '20px', padding: '6px 12px',
                fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '6px'
              }}
            >
              <Plus size={16} /> New Status
            </button>
          )}
        </div>

        {/* Story Slide Content */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          {activeItem?.type === 'image' ? (
            <img 
              src={activeItem.url} 
              alt="Story" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              backgroundColor: activeItem?.bgColor || '#111b21',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '40px', textAlign: 'center', color: '#fff', fontSize: '22px', fontWeight: 500
            }}>
              {activeItem?.text}
            </div>
          )}

          {/* Caption Overlay */}
          {activeItem?.caption && (
            <div style={{
              position: 'absolute', bottom: 30, left: 16, right: 16,
              backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff',
              padding: '12px 16px', borderRadius: '8px', textAlign: 'center',
              fontSize: '14.5px', backdropFilter: 'blur(4px)'
            }}>
              {activeItem.caption}
            </div>
          )}

          {/* Nav Touch Controls */}
          <div 
            onClick={handlePrevItem}
            style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: '40%', cursor: 'pointer' }} 
          />
          <div 
            onClick={handleNextItem}
            style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: '40%', cursor: 'pointer' }} 
          />
        </div>
      </div>

      {/* Add New Status Modal Form */}
      {isAddingStatus && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)',
          zIndex: 120, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-secondary)', padding: '24px', borderRadius: '16px',
            width: '360px', display: 'flex', flexDirection: 'column', gap: '16px'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Create New Status</h3>
            <textarea 
              rows={4}
              placeholder="What's on your mind?"
              value={newStatusText}
              onChange={(e) => setNewStatusText(e.target.value)}
              style={{
                width: '100%', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)',
                border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px',
                fontSize: '14px', outline: 'none', resize: 'none'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button 
                onClick={() => setIsAddingStatus(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateStatus}
                style={{
                  backgroundColor: 'var(--accent)', color: '#111b21',
                  border: 'none', borderRadius: '8px', padding: '8px 16px',
                  fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                }}
              >
                <Send size={16} /> Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
