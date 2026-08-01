import React, { useState, useEffect } from 'react';
import { WhatsAppProvider, useWhatsApp } from './context/WhatsAppContext';
import { Sidebar } from './components/Sidebar/Sidebar';
import { ChatArea } from './components/Chat/ChatArea';
import { StatusView } from './components/Sidebar/StatusView';
import { ProfileSettings } from './components/Sidebar/ProfileSettings';
import { NewChatModal } from './components/Sidebar/NewChatModal';
import { CallModal } from './components/Call/CallModal';
import { MediaPreviewModal } from './components/Media/MediaPreviewModal';
import { AuthModal } from './components/Auth/AuthModal';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import './index.css';

const MainAppLayout = () => {
  const { theme, activeTab, setActiveTab, setUser } = useWhatsApp();

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [drawerMode, setDrawerMode] = useState(null); // 'profile' | 'settings' | null

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser((prev) => ({
          ...prev,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || firebaseUser.phoneNumber || 'Firebase User',
          email: firebaseUser.email,
          phone: firebaseUser.phoneNumber || prev.phone,
          avatar: firebaseUser.photoURL || prev.avatar,
          uid: firebaseUser.uid
        }));
      }
    });
    return () => unsubscribe();
  }, [setUser]);

  return (
    <div className="app-container" data-theme={theme}>
      {/* Left Sidebar */}
      <Sidebar 
        onOpenProfile={() => setDrawerMode('profile')}
        onOpenStatusModal={() => setShowStatusModal(true)}
        onOpenNewChatModal={() => setShowNewChatModal(true)}
        onOpenAuthModal={() => setShowAuthModal(true)}
      />

      {/* Main Chat Conversation View */}
      <ChatArea onOpenAuthModal={() => setShowAuthModal(true)} />

      {/* Slide-out Drawer for Profile & Settings */}
      {drawerMode && (
        <ProfileSettings 
          mode={drawerMode} 
          onClose={() => setDrawerMode(null)} 
        />
      )}

      {/* Settings tab drawer overlay if selected from menu */}
      {activeTab === 'settings' && (
        <ProfileSettings 
          mode="settings"
          onClose={() => setActiveTab('chats')}
        />
      )}

      {/* WhatsApp Stories / Status Modal Overlay */}
      {showStatusModal && (
        <StatusView onClose={() => setShowStatusModal(false)} />
      )}

      {/* New Chat Modal Overlay */}
      {showNewChatModal && (
        <NewChatModal onClose={() => setShowNewChatModal(false)} />
      )}

      {/* Firebase Auth Modal Overlay */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}

      {/* Audio / Video Call Modal */}
      <CallModal />

      {/* Lightbox Media Preview Modal */}
      <MediaPreviewModal />
    </div>
  );
};

export function App() {
  return (
    <WhatsAppProvider>
      <MainAppLayout />
    </WhatsAppProvider>
  );
}

export default App;
