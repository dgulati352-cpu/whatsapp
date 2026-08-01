import React, { useState } from 'react';
import { useWhatsApp } from '../../context/WhatsAppContext';
import { ArrowLeft, Camera, Edit2, Check, Moon, Sun, Volume2, VolumeX, Palette } from 'lucide-react';

export const ProfileSettings = ({ mode = 'profile', onClose }) => {
  const { 
    user, 
    setUser, 
    theme, 
    setTheme, 
    soundEnabled, 
    setSoundEnabled,
    currentWallpaper,
    setCurrentWallpaper,
    wallpapersList 
  } = useWhatsApp();

  const [name, setName] = useState(user.name);
  const [about, setAbout] = useState(user.about);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingAbout, setIsEditingAbout] = useState(false);

  const handleSaveName = () => {
    setUser((prev) => ({ ...prev, name }));
    setIsEditingName(false);
  };

  const handleSaveAbout = () => {
    setUser((prev) => ({ ...prev, about }));
    setIsEditingAbout(false);
  };

  return (
    <div style={{
      position: 'absolute', inset: 0,
      backgroundColor: 'var(--bg-primary)',
      zIndex: 30, display: 'flex', flexDirection: 'column',
      animation: 'slideInDrawer 0.25s ease-out forwards'
    }}>
      {/* Header */}
      <header style={{
        height: '108px', backgroundColor: 'var(--bg-secondary)',
        padding: '0 20px', display: 'flex', alignItems: 'flex-end',
        paddingBottom: '16px', gap: '20px', borderBottom: '1px solid var(--border-color)'
      }}>
        <button 
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}
        >
          <ArrowLeft size={22} />
        </button>
        <h2 style={{ fontSize: '19px', fontWeight: 600 }}>
          {mode === 'profile' ? 'Profile' : 'Settings & Wallpaper'}
        </h2>
      </header>

      {/* Drawer Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {mode === 'profile' ? (
          <>
            {/* Avatar Section */}
            <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
              <div style={{ position: 'relative' }}>
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  style={{ width: 160, height: 160, borderRadius: '50%', objectFit: 'cover' }}
                />
                <label style={{
                  position: 'absolute', bottom: 6, right: 6,
                  backgroundColor: 'var(--accent)', color: '#111b21',
                  width: 40, height: 40, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', boxShadow: 'var(--shadow-md)'
                }}>
                  <Camera size={20} />
                  <input type="file" accept="image/*" hidden onChange={(e) => {
                    if (e.target.files[0]) {
                      setUser(prev => ({ ...prev, avatar: URL.createObjectURL(e.target.files[0]) }));
                    }
                  }} />
                </label>
              </div>
            </div>

            {/* Editable Name */}
            <div style={{
              backgroundColor: 'var(--bg-secondary)', padding: '16px', borderRadius: '12px',
              display: 'flex', flexDirection: 'column', gap: '8px'
            }}>
              <span style={{ fontSize: '13px', color: 'var(--accent)', fontWeight: 500 }}>Your name</span>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {isEditingName ? (
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      background: 'none', border: 'none', borderBottom: '2px solid var(--accent)',
                      color: 'var(--text-primary)', fontSize: '16px', outline: 'none', flex: 1
                    }}
                  />
                ) : (
                  <span style={{ fontSize: '16px', fontWeight: 500 }}>{user.name}</span>
                )}
                <button 
                  onClick={isEditingName ? handleSaveName : () => setIsEditingName(true)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                >
                  {isEditingName ? <Check size={20} style={{ color: 'var(--accent)' }} /> : <Edit2 size={18} />}
                </button>
              </div>
            </div>

            {/* Editable About */}
            <div style={{
              backgroundColor: 'var(--bg-secondary)', padding: '16px', borderRadius: '12px',
              display: 'flex', flexDirection: 'column', gap: '8px'
            }}>
              <span style={{ fontSize: '13px', color: 'var(--accent)', fontWeight: 500 }}>About</span>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {isEditingAbout ? (
                  <input 
                    type="text" 
                    value={about} 
                    onChange={(e) => setAbout(e.target.value)}
                    style={{
                      background: 'none', border: 'none', borderBottom: '2px solid var(--accent)',
                      color: 'var(--text-primary)', fontSize: '15px', outline: 'none', flex: 1
                    }}
                  />
                ) : (
                  <span style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>{user.about}</span>
                )}
                <button 
                  onClick={isEditingAbout ? handleSaveAbout : () => setIsEditingAbout(true)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                >
                  {isEditingAbout ? <Check size={20} style={{ color: 'var(--accent)' }} /> : <Edit2 size={18} />}
                </button>
              </div>
            </div>

            {/* Phone Number Readonly */}
            <div style={{
              backgroundColor: 'var(--bg-secondary)', padding: '16px', borderRadius: '12px',
              display: 'flex', flexDirection: 'column', gap: '4px'
            }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Phone number</span>
              <span style={{ fontSize: '15px', fontWeight: 500 }}>{user.phone}</span>
            </div>
          </>
        ) : (
          <>
            {/* Theme Toggle option */}
            <div style={{
              backgroundColor: 'var(--bg-secondary)', padding: '16px', borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer'
            }} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                {theme === 'dark' ? <Moon size={22} style={{ color: 'var(--accent)' }} /> : <Sun size={22} style={{ color: 'var(--accent)' }} />}
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 500 }}>Theme Mode</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Currently: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</div>
                </div>
              </div>
            </div>

            {/* Sound Toggle option */}
            <div style={{
              backgroundColor: 'var(--bg-secondary)', padding: '16px', borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer'
            }} onClick={() => setSoundEnabled(!soundEnabled)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                {soundEnabled ? <Volume2 size={22} style={{ color: 'var(--accent)' }} /> : <VolumeX size={22} style={{ color: 'var(--text-muted)' }} />}
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 500 }}>Notification Sounds</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{soundEnabled ? 'Chimes active' : 'Muted'}</div>
                </div>
              </div>
            </div>

            {/* Chat Wallpaper Chooser */}
            <div style={{
              backgroundColor: 'var(--bg-secondary)', padding: '16px', borderRadius: '12px',
              display: 'flex', flexDirection: 'column', gap: '14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Palette size={20} style={{ color: 'var(--accent)' }} />
                <span style={{ fontSize: '16px', fontWeight: 500 }}>Chat Wallpaper</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                {wallpapersList.map((wp) => (
                  <div 
                    key={wp.id}
                    onClick={() => setCurrentWallpaper(wp.id)}
                    style={{
                      height: '70px', borderRadius: '8px', background: wp.bg,
                      border: currentWallpaper === wp.id ? '3px solid var(--accent)' : '1px solid var(--border-color)',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontSize: '12px', fontWeight: 600, textShadow: '0 1px 3px rgba(0,0,0,0.8)'
                    }}
                  >
                    {wp.name}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
