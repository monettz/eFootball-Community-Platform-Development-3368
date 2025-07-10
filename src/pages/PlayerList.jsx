import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSocket } from '../contexts/SocketContext';
import { useAuth } from '../contexts/AuthContext';
import { countries } from '../data/countries';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUsers, FiGlobe, FiFilter, FiMessageSquare, FiUserPlus, FiSearch } = FiIcons;

const PlayerList = () => {
  const { onlineUsers } = useSocket();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCountry, setFilterCountry] = useState('');
  const [filterRank, setFilterRank] = useState('');

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

  const filteredPlayers = onlineUsers.filter(player => {
    const matchesSearch = player.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = !filterCountry || player.country === filterCountry;
    const matchesRank = !filterRank || player.rank === filterRank;
    return matchesSearch && matchesCountry && matchesRank;
  });

  const uniqueCountries = [...new Set(onlineUsers.map(p => p.country))];
  const uniqueRanks = [...new Set(onlineUsers.map(p => p.rank))];

  return (
    <div className="min-h-screen bg-dark-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <SafeIcon icon={FiUsers} className="w-8 h-8 text-primary-400" />
              <h1 className="text-3xl font-bold text-white">Global Players</h1>
            </div>
            <div className="flex items-center space-x-2 bg-dark-800 rounded-lg px-4 py-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm text-gray-300">{onlineUsers.length} online</span>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search players..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-dark-800 border border-dark-700 rounded-lg px-10 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <select
              value={filterCountry}
              onChange={(e) => setFilterCountry(e.target.value)}
              className="bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Countries</option>
              {uniqueCountries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>

            <select
              value={filterRank}
              onChange={(e) => setFilterRank(e.target.value)}
              className="bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Ranks</option>
              {uniqueRanks.map(rank => (
                <option key={rank} value={rank}>{rank}</option>
              ))}
            </select>

            <button className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center">
              <SafeIcon icon={FiFilter} className="w-4 h-4 mr-2" />
              Filter
            </button>
          </div>
        </motion.div>

        {/* Players Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlayers.map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-dark-800 rounded-xl p-6 border border-dark-700 hover:border-primary-500 transition-colors"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-2xl">
                  {getCountryFlag(player.country)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`text-sm font-medium ${getRankColor(player.rank)}`}>
                      {player.rank}
                    </span>
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  </div>
                  <h3 className="text-lg font-bold text-white">{player.username}</h3>
                  <p className="text-sm text-gray-400">{player.country}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="text-center">
                  <p className="text-sm text-gray-400">Status</p>
                  <p className="text-sm font-medium text-green-400">Online</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-400">Rank</p>
                  <p className={`text-sm font-medium ${getRankColor(player.rank)}`}>
                    {player.rank}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-400">Region</p>
                  <p className="text-sm font-medium text-white">
                    {player.country === user?.country ? 'Same' : 'Different'}
                  </p>
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center">
                  <SafeIcon icon={FiMessageSquare} className="w-4 h-4 mr-2" />
                  Chat
                </button>
                <button className="flex-1 bg-dark-700 hover:bg-dark-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center">
                  <SafeIcon icon={FiUserPlus} className="w-4 h-4 mr-2" />
                  Add Friend
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPlayers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <SafeIcon icon={FiUsers} className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400 mb-2">No players found</h3>
            <p className="text-gray-500">Try adjusting your filters or search terms</p>
          </motion.div>
        )}

        {/* Ad Space */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xl font-bold mb-2">🌟 Premium Membership</h4>
              <p className="text-green-100 mb-4">
                Unlock exclusive features: Priority matchmaking, advanced stats, and more!
              </p>
              <button className="bg-white text-green-600 font-medium py-2 px-6 rounded-lg hover:bg-gray-100 transition-colors">
                Upgrade Now
              </button>
            </div>
            <div className="text-6xl opacity-20">
              ⚽
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PlayerList;