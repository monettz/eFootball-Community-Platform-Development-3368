import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '../contexts/SocketContext';
import { useAuth } from '../contexts/AuthContext';
import { countries } from '../data/countries';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMessageSquare, FiSend, FiUsers, FiGlobe, FiCopy, FiCheck } = FiIcons;

const Chat = () => {
  const { messages, sendMessage, onlineUsers } = useSocket();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const [matchCode, setMatchCode] = useState('');
  const [showMatchCode, setShowMatchCode] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getCountryFlag = (countryName) => {
    const country = countries.find(c => c.name === countryName);
    return country ? country.flag : '🌍';
  };

  const getRankColor = (rank) => {
    const colors = {
      'Rookie': 'text-gray-400',
      'Amateur': 'text-green-400',
      'Semi-Pro': 'text-blue-400',
      'Professional': 'text-purple-400',
      'Expert': 'text-orange-400',
      'Pro': 'text-red-400',
      'Legend': 'text-yellow-400',
      'Master': 'text-pink-400',
    };
    return colors[rank] || 'text-gray-400';
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const generateMatchCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setMatchCode(code);
    setShowMatchCode(true);
    sendMessage(`🎮 Match Code: ${code} - Anyone ready to play?`);
  };

  const copyMatchCode = () => {
    navigator.clipboard.writeText(matchCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-screen bg-dark-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-8rem)]">
          {/* Online Users Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 bg-dark-800 rounded-xl p-4 border border-dark-700"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center">
                <SafeIcon icon={FiUsers} className="w-5 h-5 mr-2 text-primary-400" />
                Online
              </h3>
              <span className="text-sm text-gray-400">{onlineUsers.length}</span>
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {onlineUsers.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-dark-700 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-sm">
                    {getCountryFlag(player.country)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1">
                      <span className={`text-xs font-medium ${getRankColor(player.rank)}`}>
                        {player.rank}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-white truncate">{player.username}</p>
                  </div>
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Chat Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-3 bg-dark-800 rounded-xl border border-dark-700 flex flex-col"
          >
            {/* Chat Header */}
            <div className="p-4 border-b border-dark-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <SafeIcon icon={FiMessageSquare} className="w-6 h-6 text-primary-400" />
                  <h2 className="text-xl font-bold text-white">Global Chat</h2>
                  <SafeIcon icon={FiGlobe} className="w-5 h-5 text-gray-400" />
                </div>
                <button
                  onClick={generateMatchCode}
                  className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Generate Match Code
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`flex ${message.sender === user?.username ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender === user?.username
                            ? 'bg-primary-600 text-white'
                            : 'bg-dark-700 text-white'
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs">
                            {getCountryFlag(message.country)}
                          </span>
                          <span className="text-xs font-medium">{message.sender}</span>
                          <span className="text-xs opacity-70">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm">{message.text}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Match Code Display */}
            <AnimatePresence>
              {showMatchCode && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mx-4 mb-4 p-4 bg-primary-600 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-primary-100">Your Match Code:</p>
                      <p className="text-xl font-bold text-white">{matchCode}</p>
                    </div>
                    <button
                      onClick={copyMatchCode}
                      className="bg-white text-primary-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-2"
                    >
                      <SafeIcon icon={copiedCode ? FiCheck : FiCopy} className="w-4 h-4" />
                      <span>{copiedCode ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Message Input */}
            <div className="p-4 border-t border-dark-700">
              <form onSubmit={handleSendMessage} className="flex space-x-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <SafeIcon icon={FiSend} className="w-4 h-4" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </motion.div>
        </div>

        {/* Ad Space */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xl font-bold mb-2">🎯 Tournament Alert!</h4>
              <p className="text-red-100 mb-4">
                Join the Global eFootball Championship! Register now and compete for amazing prizes.
              </p>
              <button className="bg-white text-red-600 font-medium py-2 px-6 rounded-lg hover:bg-gray-100 transition-colors">
                Register Now
              </button>
            </div>
            <div className="text-6xl opacity-20">
              🏆
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Chat;