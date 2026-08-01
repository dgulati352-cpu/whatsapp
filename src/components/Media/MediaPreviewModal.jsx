import React from 'react';
import { useWhatsApp } from '../../context/WhatsAppContext';
import { X, Download } from 'lucide-react';

export const MediaPreviewModal = () => {
  const { mediaPreview, setMediaPreview } = useWhatsApp();

  if (!mediaPreview) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0,
      backgroundColor: 'rgba(0,0,0,0.92)',
      zIndex: 150, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(8px)'
    }}>
      {/* Header controls */}
      <div style={{
        position: 'absolute', top: 20, right: 20,
        display: 'flex', gap: '16px', alignItems: 'center', zIndex: 160
      }}>
        <a 
          href={mediaPreview.url} 
          download 
          target="_blank" 
          rel="noreferrer"
          style={{ color: '#fff', textDecoration: 'none' }}
          title="Download Media"
        >
          <Download size={24} />
        </a>
        <button 
          onClick={() => setMediaPreview(null)}
          style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
          title="Close"
        >
          <X size={28} />
        </button>
      </div>

      {/* Main image content */}
      <div style={{ maxWidth: '90%', maxHeight: '80%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img 
          src={mediaPreview.url} 
          alt="Preview" 
          style={{
            maxWidth: '100%', maxHeight: '75vh', borderRadius: '12px',
            objectFit: 'contain', boxShadow: 'var(--shadow-lg)'
          }}
        />
        {mediaPreview.caption && (
          <p style={{ color: '#fff', marginTop: '16px', fontSize: '16px', fontWeight: 500 }}>
            {mediaPreview.caption}
          </p>
        )}
      </div>
    </div>
  );
};
