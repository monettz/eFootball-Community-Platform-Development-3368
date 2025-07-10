import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiHome, FiUsers, FiMessageSquare, FiTrophy, FiUser, FiLogOut, FiMenu, FiX } = FiIcons;

const Navbar = () => {
  const { user, logout } = useAuth();
  const { connected, onlineUsers } = useSocket();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: FiHome },
    { name: 'Players', href: '/players', icon: FiUsers },
    { name: 'Chat', href: '/chat', icon: FiMessageSquare },
    { name: 'Leaderboard', href: '/leaderboard', icon: FiTrophy },
    { name: 'Profile', href: '/profile', icon: FiUser },
  ];

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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-800/95 backdrop-blur-sm border-b border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent"
            >
              ⚽ eFootball Connect
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.href
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-300 hover:bg-dark-700 hover:text-white'
                }`}
              >
                <SafeIcon icon={item.icon} className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* User Info & Status */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className="text-sm text-gray-300">
                {onlineUsers.length} online
              </span>
            </div>
            
            <div className="flex items-center space-x-2 bg-dark-700 rounded-lg px-3 py-1">
              <span className="text-sm text-gray-300">{user?.country}</span>
              <span className={`text-sm font-medium ${getRankColor(user?.rank)}`}>
                {user?.rank}
              </span>
              <span className="text-sm font-medium text-white">{user?.username}</span>
            </div>

            <button
              onClick={logout}
              className="p-2 rounded-md text-gray-300 hover:bg-dark-700 hover:text-white transition-colors"
            >
              <SafeIcon icon={FiLogOut} className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-300 hover:bg-dark-700 hover:text-white"
            >
              <SafeIcon icon={mobileMenuOpen ? FiX : FiMenu} className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-dark-800 border-t border-dark-700"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === item.href
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-300 hover:bg-dark-700 hover:text-white'
                }`}
              >
                <SafeIcon icon={item.icon} className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            ))}
            
            <div className="pt-4 border-t border-dark-700">
              <div className="flex items-center justify-between px-3 py-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-red-400'}`} />
                  <span className="text-sm text-gray-300">
                    {onlineUsers.length} online
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 rounded-md text-gray-300 hover:bg-dark-700 hover:text-white"
                >
                  <SafeIcon icon={FiLogOut} className="w-4 h-4" />
                </button>
              </div>
              
              <div className="px-3 py-2 bg-dark-700 mx-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">{user?.country}</span>
                  <span className={`text-sm font-medium ${getRankColor(user?.rank)}`}>
                    {user?.rank}
                  </span>
                </div>
                <div className="text-sm font-medium text-white mt-1">{user?.username}</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;