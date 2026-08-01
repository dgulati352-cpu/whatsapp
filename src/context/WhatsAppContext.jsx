import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { currentUser as initialUser, initialContacts, initialMessages, initialStatuses, wallpapersList } from '../data/mockData';

const WhatsAppContext = createContext();

// Helper for Web Audio API sound effects
const playSoundEffect = (type) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    const now = ctx.currentTime;
    if (type === 'send') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'receive') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.setValueAtTime(1174.66, now + 0.08); // A5 -> D6 chime
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    }
  } catch (e) {
    console.log('Audio feedback not initialized', e);
  }
};

export const WhatsAppProvider = ({ children }) => {
  const [user, setUser] = useState(initialUser);
  const [contacts, setContacts] = useState(initialContacts);
  const [messages, setMessages] = useState(initialMessages);
  const [statuses, setStatuses] = useState(initialStatuses);
  const [activeContactId, setActiveContactId] = useState('c1');
  const [activeTab, setActiveTab] = useState('chats'); // 'chats', 'status', 'settings', 'profile'
  const [searchQuery, setSearchQuery] = useState('');
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all'); // 'all', 'unread', 'favorites', 'groups'
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [theme, setTheme] = useState('dark'); // 'dark' | 'light'
  const [currentWallpaper, setCurrentWallpaper] = useState('default');
  
  // Call State
  const [activeCall, setActiveCall] = useState(null); // { type: 'audio'|'video', contact: {}, status: 'ringing'|'connected', seconds: 0 }
  const callTimerRef = useRef(null);

  // Lightbox Media State
  const [mediaPreview, setMediaPreview] = useState(null); // { type: 'image'|'video', url, caption }

  // Voice Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const recordTimerRef = useRef(null);

  // Status view modal state
  const [activeStatusUser, setActiveStatusUser] = useState(null);

  // Update unread count when active contact changes
  useEffect(() => {
    if (activeContactId) {
      setContacts((prev) =>
        prev.map((c) => (c.id === activeContactId ? { ...c, unreadCount: 0 } : c))
      );
    }
  }, [activeContactId]);

  // Handle active call timer
  useEffect(() => {
    if (activeCall && activeCall.status === 'connected') {
      callTimerRef.current = setInterval(() => {
        setActiveCall((prev) => (prev ? { ...prev, seconds: prev.seconds + 1 } : null));
      }, 1000);
    } else {
      clearInterval(callTimerRef.current);
    }
    return () => clearInterval(callTimerRef.current);
  }, [activeCall?.status]);

  // Send a message
  const sendMessage = (text, type = 'text', mediaPayload = {}) => {
    if (!activeContactId) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg = {
      id: 'm_' + Date.now(),
      senderId: 'user_me',
      senderName: user.name,
      timestamp: timeStr,
      status: 'sent',
      type,
      text: text || '',
      ...mediaPayload
    };

    setMessages((prev) => {
      const contactMsgs = prev[activeContactId] || [];
      return {
        ...prev,
        [activeContactId]: [...contactMsgs, newMsg]
      };
    });

    if (soundEnabled) playSoundEffect('send');

    // Simulate status update to delivered -> read
    setTimeout(() => {
      setMessages((prev) => {
        const contactMsgs = prev[activeContactId] || [];
        return {
          ...prev,
          [activeContactId]: contactMsgs.map((m) => (m.id === newMsg.id ? { ...m, status: 'read' } : m))
        };
      });
    }, 1200);

    // Simulate Auto-Reply from contact
    triggerAutoReply(activeContactId);
  };

  // Trigger contact auto-reply
  const triggerAutoReply = (contactId) => {
    const targetContact = contacts.find((c) => c.id === contactId);
    if (!targetContact || !targetContact.autoReply) return;

    // Set contact to typing
    setTimeout(() => {
      setContacts((prev) =>
        prev.map((c) => (c.id === contactId ? { ...c, typing: true } : c))
      );
    }, 1500);

    // Send reply after typing delay
    setTimeout(() => {
      setContacts((prev) =>
        prev.map((c) => (c.id === contactId ? { ...c, typing: false } : c))
      );

      const replies = targetContact.autoReply;
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const replyMsg = {
        id: 'm_reply_' + Date.now(),
        senderId: contactId,
        senderName: targetContact.name,
        text: randomReply,
        timestamp: replyTime,
        status: 'read',
        type: 'text'
      };

      setMessages((prev) => {
        const currentMsgs = prev[contactId] || [];
        return {
          ...prev,
          [contactId]: [...currentMsgs, replyMsg]
        };
      });

      // Update unread count if contact is not active
      setContacts((prev) =>
        prev.map((c) => {
          if (c.id === contactId) {
            return {
              ...c,
              unreadCount: activeContactId === contactId ? 0 : (c.unreadCount || 0) + 1
            };
          }
          return c;
        })
      );

      if (soundEnabled) playSoundEffect('receive');
    }, 3500);
  };

  // Voice recording simulation
  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    recordTimerRef.current = setInterval(() => {
      setRecordingTime((t) => t + 1);
    }, 1000);
  };

  const stopAndSendRecording = () => {
    clearInterval(recordTimerRef.current);
    setIsRecording(false);
    
    const minutes = Math.floor(recordingTime / 60);
    const seconds = recordingTime % 60;
    const durStr = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    sendMessage('', 'audio', {
      audioUrl: 'https://actions.google.com/sounds/v1/ambiences/rain_heavy.ogg',
      duration: durStr || '0:05',
      waves: [15, 30, 60, 90, 45, 75, 50, 85, 30, 65, 40, 80, 50, 20]
    });
    setRecordingTime(0);
  };

  const cancelRecording = () => {
    clearInterval(recordTimerRef.current);
    setIsRecording(false);
    setRecordingTime(0);
  };

  // Toggle Pin chat
  const togglePinContact = (contactId, e) => {
    if (e) e.stopPropagation();
    setContacts((prev) =>
      prev.map((c) => (c.id === contactId ? { ...c, pinned: !c.pinned } : c))
    );
  };

  // Toggle Star contact
  const toggleStarContact = (contactId, e) => {
    if (e) e.stopPropagation();
    setContacts((prev) =>
      prev.map((c) => (c.id === contactId ? { ...c, starred: !c.starred } : c))
    );
  };

  // Start Call
  const startCall = (type, contact = null) => {
    const target = contact || contacts.find((c) => c.id === activeContactId);
    if (!target) return;

    setActiveCall({
      type,
      contact: target,
      status: 'ringing',
      seconds: 0
    });

    // Auto connect after 2.5 seconds ringing
    setTimeout(() => {
      setActiveCall((prev) => (prev ? { ...prev, status: 'connected' } : null));
    }, 2500);
  };

  const endCall = () => {
    if (!activeCall) return;
    setActiveCall((prev) => (prev ? { ...prev, status: 'ended' } : null));
    setTimeout(() => {
      setActiveCall(null);
    }, 800);
  };

  // Add new status
  const addNewStatus = (text, caption = '') => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newItem = {
      id: 'st_' + Date.now(),
      type: 'text',
      bgColor: '#00a884',
      text: text || 'Enjoying WhatsApp Web! 💬✨',
      timestamp: timeStr
    };

    setStatuses((prev) => {
      return prev.map((s) => {
        if (s.userId === 'user_me') {
          return {
            ...s,
            time: 'Just now',
            items: [newItem, ...s.items]
          };
        }
        return s;
      });
    });
  };

  // Filter contacts by category & search
  const filteredContacts = contacts.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.about.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (filterCategory === 'unread') return c.unreadCount > 0;
    if (filterCategory === 'favorites') return c.starred === true;
    if (filterCategory === 'groups') return c.isGroup === true;
    return true;
  });

  // Sort contacts: pinned first, then by latest message
  const sortedContacts = [...filteredContacts].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });

  const activeContact = contacts.find((c) => c.id === activeContactId);
  const activeMessages = messages[activeContactId] || [];

  return (
    <WhatsAppContext.Provider
      value={{
        user,
        setUser,
        contacts: sortedContacts,
        allContacts: contacts,
        activeContact,
        activeContactId,
        setActiveContactId,
        activeMessages,
        sendMessage,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        chatSearchQuery,
        setChatSearchQuery,
        filterCategory,
        setFilterCategory,
        soundEnabled,
        setSoundEnabled,
        theme,
        setTheme,
        currentWallpaper,
        setCurrentWallpaper,
        wallpapersList,
        isRecording,
        recordingTime,
        startRecording,
        stopAndSendRecording,
        cancelRecording,
        togglePinContact,
        toggleStarContact,
        activeCall,
        startCall,
        endCall,
        statuses,
        activeStatusUser,
        setActiveStatusUser,
        addNewStatus,
        mediaPreview,
        setMediaPreview
      }}
    >
      {children}
    </WhatsAppContext.Provider>
  );
};

export const useWhatsApp = () => useContext(WhatsAppContext);
