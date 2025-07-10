import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { countries } from '../data/countries';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUsers, FiMessageSquare, FiTrophy, FiGlobe, FiTrendingUp, FiTarget } = FiIcons;

const Dashboard = () => {
  const { user } = useAuth();
  const { onlineUsers } = useSocket();

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

  const stats = [
    { name: 'Online Players', value: onlineUsers.length, icon: FiUsers, color: 'text-green-400' },
    { name: 'Your Rank', value: user?.rank, icon: FiTrophy, color: getRankColor(user?.rank) },
    { name: 'Total Points', value: user?.points || 0, icon: FiTarget, color: 'text-blue-400' },
    { name: 'Win Rate', value: user?.wins && user?.losses ? Math.round((user.wins / (user.wins + user.losses)) * 100) + '%' : '0%', icon: FiTrendingUp, color: 'text-purple-400' },
  ];

  return (
    <div className="min-h-screen bg-dark-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Welcome back, {user?.username}! {getCountryFlag(user?.country)}
                </h1>
                <p className="text-primary-100">
                  Ready to dominate the pitch? Connect with players worldwide and climb the ranks!
                </p>
              </div>
              <div className="text-6xl opacity-20">
                ⚽
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-dark-800 rounded-xl p-6 border border-dark-700 hover:border-primary-500 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{stat.name}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <SafeIcon icon={stat.icon} className={`w-8 h-8 ${stat.color}`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Online Players */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-dark-800 rounded-xl p-6 border border-dark-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                <SafeIcon icon={FiUsers} className="w-5 h-5 mr-2 text-primary-400" />
                Online Players
              </h2>
              <span className="text-sm text-gray-400">{onlineUsers.length} active</span>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {onlineUsers.map((player) => (
                <motion.div
                  key={player.id}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-between p-3 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                      {getCountryFlag(player.country)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-medium ${getRankColor(player.rank)}`}>
                          {player.rank}
                        </span>
                        <span className="text-white font-medium">{player.username}</span>
                      </div>
                      <p className="text-sm text-gray-400">{player.country}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-green-400">Online</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions & Ads */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Quick Actions */}
            <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
              <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center">
                  <SafeIcon icon={FiMessageSquare} className="w-4 h-4 mr-2" />
                  Join Global Chat
                </button>
                <button className="w-full bg-dark-700 hover:bg-dark-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center">
                  <SafeIcon icon={FiTrophy} className="w-4 h-4 mr-2" />
                  View Leaderboard
                </button>
                <button className="w-full bg-dark-700 hover:bg-dark-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center">
                  <SafeIcon icon={FiGlobe} className="w-4 h-4 mr-2" />
                  Find Players
                </button>
              </div>
            </div>

            {/* Ad Space */}
            <div className="bg-gradient-to-br from-yellow-600 to-orange-600 rounded-xl p-6 text-white">
              <h4 className="font-bold mb-2">🎮 Gaming Gear Sale!</h4>
              <p className="text-sm text-yellow-100 mb-4">
                Get 30% off on premium gaming controllers and accessories. Perfect for eFootball!
              </p>
              <button className="w-full bg-white text-orange-600 font-medium py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors">
                Shop Now
              </button>
            </div>

            {/* Another Ad Space */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 text-white">
              <h4 className="font-bold mb-2">⚡ Pro Tips Course</h4>
              <p className="text-sm text-purple-100 mb-4">
                Master advanced eFootball techniques with our exclusive video series.
              </p>
              <button className="w-full bg-white text-purple-600 font-medium py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors">
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;