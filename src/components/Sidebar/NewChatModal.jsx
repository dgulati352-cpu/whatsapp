import React, { useState } from 'react';
import { useWhatsApp } from '../../context/WhatsAppContext';
import { X, Search, UserPlus, Users } from 'lucide-react';

export const NewChatModal = ({ onClose }) => {
  const { allContacts, setActiveContactId, setUser } = useWhatsApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const filtered = allContacts.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{
      position: 'fixed', inset: 0,
      backgroundColor: 'rgba(0,0,0,0.75)',
      zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-secondary)', width: '420px', maxWidth: '92vw',
        borderRadius: '16px', border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-lg)', overflow: 'hidden', display: 'flex', flexDirection: 'column'
      }}>
        {/* Top Header */}
        <div style={{
          padding: '16px 20px', borderBottom: '1px solid var(--border-color)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600 }}>New Chat</h3>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Search Input */}
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)' }}>
          <div className="search-input-wrapper">
            <Search size={18} style={{ color: 'var(--text-secondary)' }} />
            <input 
              type="text"
              placeholder="Search contact name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Action button to add contact */}
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)' }}>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            style={{
              width: '100%', backgroundColor: 'var(--accent-light)', color: 'var(--accent)',
              border: 'none', borderRadius: '8px', padding: '10px', fontWeight: 600,
              fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center',
              justify: 'center', gap: '8px'
            }}
          >
            <UserPlus size={18} /> Add New Custom Contact
          </button>
        </div>

        {showAddForm && (
          <div style={{ padding: '16px', backgroundColor: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input 
              type="text"
              placeholder="Contact Name"
              value={newContactName}
              onChange={(e) => setNewContactName(e.target.value)}
              style={{
                backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
                borderRadius: '8px', padding: '8px 12px', color: 'var(--text-primary)', outline: 'none'
              }}
            />
            <input 
              type="text"
              placeholder="Phone Number"
              value={newContactPhone}
              onChange={(e) => setNewContactPhone(e.target.value)}
              style={{
                backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
                borderRadius: '8px', padding: '8px 12px', color: 'var(--text-primary)', outline: 'none'
              }}
            />
            <button 
              onClick={() => {
                if (!newContactName.trim()) return;
                // Simply select first contact or alert
                setShowAddForm(false);
              }}
              style={{
                backgroundColor: 'var(--accent)', color: '#111b21', border: 'none',
                borderRadius: '8px', padding: '8px', fontWeight: 600, cursor: 'pointer'
              }}
            >
              Save Contact
            </button>
          </div>
        )}

        {/* Contact List */}
        <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
          {filtered.map((contact) => (
            <div 
              key={contact.id}
              onClick={() => {
                setActiveContactId(contact.id);
                onClose();
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid var(--divider-color)',
                transition: 'background 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <img 
                src={contact.avatar} 
                alt={contact.name}
                style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '15px', fontWeight: 500 }}>{contact.name}</span>
                <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{contact.about}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
