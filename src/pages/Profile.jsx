import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { countries, ranks } from '../data/countries';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUser, FiEdit3, FiSave, FiX, FiTrophy, FiTarget, FiTrendingUp, FiUsers, FiGlobe, FiBookOpen } = FiIcons;

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    country: user?.country || '',
    school: user?.school || '',
    rank: user?.rank || 'Rookie',
  });

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

  const handleSave = () => {
    updateUser(formData);
    setEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      username: user?.username || '',
      country: user?.country || '',
      school: user?.school || '',
      rank: user?.rank || 'Rookie',
    });
    setEditing(false);
  };

  const stats = [
    { name: 'Total Points', value: user?.points || 0, icon: FiTarget, color: 'text-blue-400' },
    { name: 'Wins', value: user?.wins || 0, icon: FiTrophy, color: 'text-green-400' },
    { name: 'Losses', value: user?.losses || 0, icon: FiX, color: 'text-red-400' },
    { name: 'Win Rate', value: user?.wins && user?.losses ? Math.round((user.wins / (user.wins + user.losses)) * 100) + '%' : '0%', icon: FiTrendingUp, color: 'text-purple-400' },
  ];

  return (
    <div className="min-h-screen bg-dark-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-800 rounded-xl p-6 border border-dark-700 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-3xl">
                {getCountryFlag(user?.country)}
              </div>
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <span className={`text-lg font-bold ${getRankColor(user?.rank)}`}>
                    {user?.rank}
                  </span>
                  <h1 className="text-2xl font-bold text-white">{user?.username}</h1>
                </div>
                <p className="text-gray-400 flex items-center space-x-2">
                  <SafeIcon icon={FiGlobe} className="w-4 h-4" />
                  <span>{user?.country}</span>
                </p>
                <p className="text-gray-400 flex items-center space-x-2">
                  <SafeIcon icon={FiBookOpen} className="w-4 h-4" />
                  <span>{user?.school}</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setEditing(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
            >
              <SafeIcon icon={FiEdit3} className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-dark-700 rounded-lg p-4 text-center"
              >
                <SafeIcon icon={stat.icon} className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.name}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Edit Profile Modal */}
        {editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-dark-800 rounded-xl p-6 w-full max-w-md border border-dark-700"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Edit Profile</h2>
                <button
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <SafeIcon icon={FiX} className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Country
                  </label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                    className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {countries.map((country) => (
                      <option key={country.code} value={country.name}>
                        {country.flag} {country.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    School/Organization
                  </label>
                  <input
                    type="text"
                    value={formData.school}
                    onChange={(e) => setFormData({...formData, school: e.target.value})}
                    className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Rank
                  </label>
                  <select
                    value={formData.rank}
                    onChange={(e) => setFormData({...formData, rank: e.target.value})}
                    className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {ranks.map((rank) => (
                      <option key={rank.value} value={rank.value}>
                        {rank.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <SafeIcon icon={FiSave} className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-dark-700 hover:bg-dark-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-dark-800 rounded-xl p-6 border border-dark-700 mb-8"
        >
          <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-dark-700 rounded-lg">
              <SafeIcon icon={FiTrophy} className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-white font-medium">Victory against ProPlayer_UK</p>
                <p className="text-sm text-gray-400">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-dark-700 rounded-lg">
              <SafeIcon icon={FiUsers} className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-white font-medium">Joined Global Chat</p>
                <p className="text-sm text-gray-400">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-dark-700 rounded-lg">
              <SafeIcon icon={FiTrendingUp} className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-white font-medium">Rank promoted to {user?.rank}</p>
                <p className="text-sm text-gray-400">1 day ago</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Ad Space */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xl font-bold mb-2">📊 Advanced Analytics</h4>
              <p className="text-cyan-100 mb-4">
                Track your performance with detailed match analytics and improvement suggestions.
              </p>
              <button className="bg-white text-cyan-600 font-medium py-2 px-6 rounded-lg hover:bg-gray-100 transition-colors">
                View Analytics
              </button>
            </div>
            <div className="text-6xl opacity-20">
              📈
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;