import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);

  // Mock socket functionality for demo
  useEffect(() => {
    if (user) {
      setConnected(true);
      // Simulate online users
      const mockUsers = [
        { id: 1, username: 'ProPlayer_BR', country: 'Brazil', rank: 'Legend', online: true },
        { id: 2, username: 'SkillMaster_UK', country: 'United Kingdom', rank: 'Pro', online: true },
        { id: 3, username: 'GoalKing_ESP', country: 'Spain', rank: 'Expert', online: true },
        { id: 4, username: 'Striker_GER', country: 'Germany', rank: 'Pro', online: true },
        { id: 5, username: 'Defender_ITA', country: 'Italy', rank: 'Legend', online: true },
      ];
      setOnlineUsers(mockUsers);
    } else {
      setConnected(false);
      setOnlineUsers([]);
    }
  }, [user]);

  const sendMessage = (message) => {
    const newMessage = {
      id: Date.now(),
      text: message,
      sender: user.username,
      timestamp: new Date(),
      country: user.country
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const value = {
    connected,
    onlineUsers,
    messages,
    sendMessage
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};