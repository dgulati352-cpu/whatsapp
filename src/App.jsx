import React, { useState } from 'react';
import { WhatsAppProvider, useWhatsApp } from './context/WhatsAppContext';
import { Sidebar } from './components/Sidebar/Sidebar';
import { ChatArea } from './components/Chat/ChatArea';
import { StatusView } from './components/Sidebar/StatusView';
import { ProfileSettings } from './components/Sidebar/ProfileSettings';
import { NewChatModal } from './components/Sidebar/NewChatModal';
import { CallModal } from './components/Call/CallModal';
import { MediaPreviewModal } from './components/Media/MediaPreviewModal';
import './index.css';

const MainAppLayout = () => {
  const { theme, activeTab, setActiveTab } = useWhatsApp();

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [drawerMode, setDrawerMode] = useState(null); // 'profile' | 'settings' | null

  return (
    <div className="app-container" data-theme={theme}>
      {/* Left Sidebar */}
      <Sidebar 
        onOpenProfile={() => setDrawerMode('profile')}
        onOpenStatusModal={() => setShowStatusModal(true)}
        onOpenNewChatModal={() => setShowNewChatModal(true)}
      />

      {/* Main Chat Conversation View */}
      <ChatArea />

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
