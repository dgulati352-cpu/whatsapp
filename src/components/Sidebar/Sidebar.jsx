import React, { useState } from 'react';
import { useWhatsApp } from '../../context/WhatsAppContext';
import { 
  MessageSquarePlus, 
  CircleDashed, 
  MoreVertical, 
  Search, 
  Pin, 
  Star, 
  Users, 
  CheckCheck, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  User, 
  Settings, 
  Filter,
  ShieldCheck
} from 'lucide-react';

export const Sidebar = ({ onOpenProfile, onOpenStatusModal, onOpenNewChatModal, onOpenAuthModal }) => {
  const { 
    user, 
    contacts, 
    activeContactId, 
    setActiveContactId, 
    searchQuery, 
    setSearchQuery, 
    filterCategory, 
    setFilterCategory,
    togglePinContact,
    toggleStarContact,
    theme,
    setTheme,
    soundEnabled,
    setSoundEnabled,
    setActiveTab,
    statuses
  } = useWhatsApp();

  const [showMenu, setShowMenu] = useState(false);

  const unseenStatusesExist = statuses.some(s => s.unseen);

  return (
    <aside className="sidebar">
      {/* Sidebar Top Header */}
      <header className="sidebar-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="user-avatar"
            onClick={onOpenProfile}
            title="Profile Details"
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 600, fontSize: '15px' }}>{user.name}</span>
            {user.email && (
              <span style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 500 }}>
                {user.email}
              </span>
            )}
          </div>
        </div>

        <div className="sidebar-actions">
          {/* Firebase Auth Trigger Button */}
          <button 
            className="icon-btn"
            onClick={onOpenAuthModal}
            title="Firebase Authentication (Email, Google, Phone)"
            style={{ color: 'var(--accent)' }}
          >
            <ShieldCheck size={20} />
          </button>

          {/* Status / Stories Button */}
          <button 
            className={`icon-btn ${unseenStatusesExist ? 'active' : ''}`}
            onClick={onOpenStatusModal}
            title="Status updates"
          >
            <CircleDashed size={20} />
            {unseenStatusesExist && (
              <span style={{
                position: 'absolute',
                top: 6,
                right: 6,
                width: 8,
                height: 8,
                backgroundColor: 'var(--accent)',
                borderRadius: '50%'
              }} />
            )}
          </button>

          {/* New Chat Button */}
          <button 
            className="icon-btn"
            onClick={onOpenNewChatModal}
            title="New Chat"
          >
            <MessageSquarePlus size={20} />
          </button>

          {/* Theme Switcher Button */}
          <button 
            className="icon-btn"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Menu Dropdown Button */}
          <div style={{ position: 'relative' }}>
            <button 
              className="icon-btn"
              onClick={() => setShowMenu(!showMenu)}
              title="Menu"
            >
              <MoreVertical size={20} />
            </button>

            {showMenu && (
              <div 
                style={{
                  position: 'absolute',
                  top: '42px',
                  right: 0,
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  boxShadow: 'var(--shadow-md)',
                  width: '190px',
                  padding: '6px 0',
                  zIndex: 50
                }}
              >
                <div 
                  style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px' }}
                  onClick={() => { onOpenAuthModal(); setShowMenu(false); }}
                >
                  <ShieldCheck size={16} /> Firebase Auth
                </div>
                <div 
                  style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px' }}
                  onClick={() => { onOpenProfile(); setShowMenu(false); }}
                >
                  <User size={16} /> Profile
                </div>
                <div 
                  style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px' }}
                  onClick={() => { setActiveTab('settings'); setShowMenu(false); }}
                >
                  <Settings size={16} /> Settings
                </div>
                <div 
                  style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px' }}
                  onClick={() => { setSoundEnabled(!soundEnabled); setShowMenu(false); }}
                >
                  {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                  {soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Search & Category Filter Chips */}
      <div className="search-bar-container">
        <div className="search-input-wrapper">
          <Search size={18} style={{ color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Search or start new chat..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="category-filters">
          <button 
            className={`filter-chip ${filterCategory === 'all' ? 'active' : ''}`}
            onClick={() => setFilterCategory('all')}
          >
            All
          </button>
          <button 
            className={`filter-chip ${filterCategory === 'unread' ? 'active' : ''}`}
            onClick={() => setFilterCategory('unread')}
          >
            Unread
          </button>
          <button 
            className={`filter-chip ${filterCategory === 'favorites' ? 'active' : ''}`}
            onClick={() => setFilterCategory('favorites')}
          >
            Favorites
          </button>
          <button 
            className={`filter-chip ${filterCategory === 'groups' ? 'active' : ''}`}
            onClick={() => setFilterCategory('groups')}
          >
            Groups
          </button>
        </div>
      </div>

      {/* Chat Contact List */}
      <div className="chat-list">
        {contacts.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px' }}>
            No chats found for "{searchQuery}"
          </div>
        ) : (
          contacts.map((contact) => {
            const isSelected = contact.id === activeContactId;

            return (
              <div 
                key={contact.id}
                className={`chat-item ${isSelected ? 'active' : ''}`}
                onClick={() => setActiveContactId(contact.id)}
              >
                <div className="chat-item-avatar-wrapper">
                  <img 
                    src={contact.avatar} 
                    alt={contact.name} 
                    className="chat-item-avatar" 
                  />
                  {contact.online && <div className="online-dot" />}
                </div>

                <div className="chat-item-content">
                  <div className="chat-item-top">
                    <span className="chat-item-name">{contact.name}</span>
                    <span className="chat-item-time">{contact.lastSeen}</span>
                  </div>

                  <div className="chat-item-bottom">
                    <span className="chat-item-preview">
                      {contact.typing ? (
                        <span style={{ color: 'var(--accent)', fontWeight: 500 }}>typing...</span>
                      ) : (
                        contact.about
                      )}
                    </span>

                    <div className="chat-item-badges">
                      {contact.pinned && <Pin size={13} style={{ color: 'var(--text-secondary)' }} />}
                      {contact.starred && <Star size={13} style={{ color: '#f59e0b', fill: '#f59e0b' }} />}
                      {contact.unreadCount > 0 && (
                        <div className="unread-badge">{contact.unreadCount}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
};
