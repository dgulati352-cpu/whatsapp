export const currentUser = {
  id: 'user_me',
  name: 'Dhairya Gulati',
  phone: '+91 98765 43210',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  about: 'Coding the future 🚀 | Available for chats',
  status: 'online',
  customWallpaper: 'default', // 'default', 'dark', 'doodles', 'sunset', 'emerald'
};

export const initialContacts = [
  {
    id: 'c1',
    name: 'Sarah Connor',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    about: 'Tech Lead @ Cyberdyne Systems 🤖',
    phone: '+1 (555) 234-5678',
    online: true,
    typing: false,
    unreadCount: 2,
    pinned: true,
    starred: false,
    category: 'all',
    lastSeen: 'Online',
    autoReply: [
      "That sounds fantastic! Let's schedule a call soon.",
      "I'm working on the design system updates right now.",
      "Could you send me the latest preview link?",
      "Awesome work on the WhatsApp interface! 🔥"
    ]
  },
  {
    id: 'c2',
    name: 'Design Guild 🎨',
    isGroup: true,
    groupMembers: ['Sarah Connor', 'Alex Mercer', 'Elena Rostova', 'You'],
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=300&q=80',
    about: 'Official group for UI/UX Design System discussions',
    unreadCount: 0,
    pinned: true,
    starred: true,
    category: 'groups',
    lastSeen: 'Sarah, Alex, Elena...',
    autoReply: [
      "Alex: Check out the new glassmorphism theme components!",
      "Elena: The typography and color palette look super crisp.",
      "Sarah: Merging the PR into main now 🚀"
    ]
  },
  {
    id: 'c3',
    name: 'Alex Mercer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    about: 'Fullstack Architect | Coffee Enthusiast ☕',
    phone: '+1 (555) 876-5432',
    online: true,
    typing: false,
    unreadCount: 0,
    pinned: false,
    starred: false,
    category: 'favorites',
    lastSeen: 'Online',
    autoReply: [
      "Hey! Checked the API endpoints, response times look under 40ms.",
      "Let me know when you run the production build.",
      "Coffee break in 10 minutes?"
    ]
  },
  {
    id: 'c4',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    about: 'Product Manager | Innovation & Growth',
    phone: '+44 7700 900077',
    online: false,
    typing: false,
    unreadCount: 1,
    pinned: false,
    starred: false,
    category: 'all',
    lastSeen: 'Today at 3:15 PM',
    autoReply: [
      "Thanks for updating the product roadmap!",
      "I'll review the metrics and get back to you shortly."
    ]
  },
  {
    id: 'c5',
    name: 'DevOps Squad ⚡',
    isGroup: true,
    groupMembers: ['Alex Mercer', 'David Chen', 'You'],
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80',
    about: 'CI/CD Pipelines, Kubernetes, Cloud Infrastructure',
    unreadCount: 0,
    pinned: false,
    starred: false,
    category: 'groups',
    lastSeen: 'David, Alex...',
    autoReply: [
      "David: Deployment to AWS West successful!",
      "Alex: Monitoring metrics look nominal 👌"
    ]
  },
  {
    id: 'c6',
    name: 'David Chen',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    about: 'Cloud Solutions Architect ☁️',
    phone: '+1 (555) 998-1122',
    online: false,
    typing: false,
    unreadCount: 0,
    pinned: false,
    starred: false,
    category: 'all',
    lastSeen: 'Yesterday at 9:42 PM',
    autoReply: [
      "Got the cluster config updated.",
      "Catch you tomorrow morning!"
    ]
  }
];

export const initialMessages = {
  c1: [
    {
      id: 'm1',
      senderId: 'c1',
      senderName: 'Sarah Connor',
      text: 'Hey Dhairya! How is the new WhatsApp Web clone coming along?',
      timestamp: '10:15 AM',
      status: 'read',
      type: 'text'
    },
    {
      id: 'm2',
      senderId: 'user_me',
      senderName: 'Dhairya',
      text: "Hey Sarah! It's looking amazing! Built with React, Vite, glassmorphism dark theme, voice notes, calling UI, and story updates! 🚀",
      timestamp: '10:17 AM',
      status: 'read',
      type: 'text'
    },
    {
      id: 'm3',
      senderId: 'c1',
      senderName: 'Sarah Connor',
      type: 'audio',
      audioUrl: 'https://actions.google.com/sounds/v1/ambiences/rain_heavy.ogg',
      duration: '0:14',
      waves: [20, 45, 80, 60, 30, 90, 75, 50, 65, 85, 40, 20, 70, 95, 60, 40, 25, 65, 80],
      timestamp: '10:20 AM',
      status: 'read'
    },
    {
      id: 'm4',
      senderId: 'user_me',
      senderName: 'Dhairya',
      type: 'image',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      caption: 'Preview of our sleek UI design system dashboard concept 🎨',
      timestamp: '10:22 AM',
      status: 'read'
    },
    {
      id: 'm5',
      senderId: 'c1',
      senderName: 'Sarah Connor',
      text: 'That dark background and emerald accent look so sleek!',
      timestamp: '10:25 AM',
      status: 'delivered',
      type: 'text'
    },
    {
      id: 'm6',
      senderId: 'c1',
      senderName: 'Sarah Connor',
      text: 'Can we test a voice call later today?',
      timestamp: '10:26 AM',
      status: 'delivered',
      type: 'text'
    }
  ],
  c2: [
    {
      id: 'm201',
      senderId: 'c1',
      senderName: 'Sarah Connor',
      text: 'Team, welcome to the new UI/UX Design Guild workspace!',
      timestamp: 'Yesterday 4:00 PM',
      status: 'read',
      type: 'text'
    },
    {
      id: 'm202',
      senderId: 'c3',
      senderName: 'Alex Mercer',
      text: 'Glad to be here! The component architecture is coming together fast.',
      timestamp: 'Yesterday 4:05 PM',
      status: 'read',
      type: 'text'
    },
    {
      id: 'm203',
      senderId: 'user_me',
      senderName: 'Dhairya',
      type: 'document',
      docName: 'WhatsApp_UI_Specifications_v2.pdf',
      docSize: '4.2 MB',
      timestamp: 'Yesterday 4:30 PM',
      status: 'read'
    }
  ],
  c3: [
    {
      id: 'm301',
      senderId: 'c3',
      senderName: 'Alex Mercer',
      text: 'Hey Dhairya, did you check the latest performance benchmarks?',
      timestamp: '9:00 AM',
      status: 'read',
      type: 'text'
    },
    {
      id: 'm302',
      senderId: 'user_me',
      senderName: 'Dhairya',
      text: 'Yes! Lighthouse score is 98+, render times are super crisp.',
      timestamp: '9:05 AM',
      status: 'read',
      type: 'text'
    }
  ],
  c4: [
    {
      id: 'm401',
      senderId: 'c4',
      senderName: 'Elena Rostova',
      text: 'Please review the Q3 product release notes when you get a chance.',
      timestamp: '3:15 PM',
      status: 'read',
      type: 'text'
    }
  ]
};

export const initialStatuses = [
  {
    id: 's_me',
    userId: 'user_me',
    userName: 'My Status',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    time: 'Add to status',
    items: [
      {
        id: 'st_me1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
        caption: 'Building the next-gen messaging experience! 💻🔥',
        timestamp: 'Today, 11:30 AM'
      }
    ]
  },
  {
    id: 's_sarah',
    userId: 'c1',
    userName: 'Sarah Connor',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    time: '35 minutes ago',
    unseen: true,
    items: [
      {
        id: 'st_s1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
        caption: 'Morning code & coffee vibes ☕✨',
        timestamp: '35m ago'
      },
      {
        id: 'st_s2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        caption: 'Weekend retreat spot! 🌊☀️',
        timestamp: '30m ago'
      }
    ]
  },
  {
    id: 's_alex',
    userId: 'c3',
    userName: 'Alex Mercer',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    time: '2 hours ago',
    unseen: true,
    items: [
      {
        id: 'st_a1',
        type: 'text',
        bgColor: '#111b21',
        text: '“Simplicity is the prerequisite for reliability.” - Edsger W. Dijkstra 💡',
        timestamp: '2h ago'
      }
    ]
  }
];

export const wallpapersList = [
  { id: 'default', name: 'Default Dark', bg: 'var(--chat-bg)' },
  { id: 'emerald', name: 'Emerald Gradient', bg: 'linear-gradient(135deg, #0b141a 0%, #002b20 100%)' },
  { id: 'midnight', name: 'Midnight Blue', bg: 'linear-gradient(135deg, #070f1e 0%, #0f1c3f 100%)' },
  { id: 'purple', name: 'Deep Purple', bg: 'linear-gradient(135deg, #0f0919 0%, #29153d 100%)' },
  { id: 'doodles', name: 'Pattern Texture', bg: '#0b141a radial-gradient(circle, #202c33 1px, transparent 1px) 0 0/20px 20px' }
];
