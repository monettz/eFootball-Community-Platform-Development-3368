import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { countries } from '../data/countries';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiTrophy, FiAward, FiTrendingUp, FiUsers, FiGlobe, FiFilter } = FiIcons;

const Leaderboard = () => {
  const { user } = useAuth();
  const { onlineUsers } = useSocket();
  const [filterType, setFilterType] = useState('global');
  const [timeFrame, setTimeFrame] = useState('all');

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

  const getRankPoints = (rank) => {
    const points = {
      'Rookie': 100,
      'Amateur': 250,
      'Semi-Pro': 500,
      'Professional': 750,
      'Expert': 1000,
      'Pro': 1500,
      'Legend': 2000,
      'Master': 3000,
    };
    return points[rank] || 0;
  };

  // Mock leaderboard data
  const mockLeaderboard = [
    { id: 1, username: 'ProLegend_BR', country: 'Brazil', rank: 'Master', points: 3250, wins: 89, losses: 11 },
    { id: 2, username: 'SkillKing_ESP', country: 'Spain', rank: 'Legend', points: 2890, wins: 78, losses: 15 },
    { id: 3, username: 'GoalMachine_GER', country: 'Germany', rank: 'Legend', points: 2750, wins: 72, losses: 18 },
    { id: 4, username: 'Striker_ARG', country: 'Argentina', rank: 'Pro', points: 2500, wins: 65, losses: 20 },
    { id: 5, username: 'DefenderPro_ITA', country: 'Italy', rank: 'Pro', points: 2350, wins: 58, losses: 22 },
    { id: 6, username: 'MidMaster_FR', country: 'France', rank: 'Pro', points: 2200, wins: 55, losses: 25 },
    { id: 7, username: 'WingerSpeed_UK', country: 'United Kingdom', rank: 'Expert', points: 2100, wins: 52, losses: 28 },
    { id: 8, username: 'KeepClean_NL', country: 'Netherlands', rank: 'Expert', points: 2000, wins: 50, losses: 30 },
    { id: 9, username: 'TechSkill_JP', country: 'Japan', rank: 'Expert', points: 1900, wins: 48, losses: 32 },
    { id: 10, username: 'PowerShot_US', country: 'United States', rank: 'Professional', points: 1800, wins: 45, losses: 35 },
  ];

  // Add current user to leaderboard if not present
  const leaderboardData = [...mockLeaderboard];
  if (!leaderboardData.find(p => p.username === user?.username)) {
    leaderboardData.push({
      id: user?.id,
      username: user?.username,
      country: user?.country,
      rank: user?.rank,
      points: user?.points || getRankPoints(user?.rank),
      wins: user?.wins || 0,
      losses: user?.losses || 0,
    });
  }

  // Sort by points
  const sortedLeaderboard = leaderboardData.sort((a, b) => b.points - a.points);

  // Filter based on type
  const filteredLeaderboard = filterType === 'country' 
    ? sortedLeaderboard.filter(p => p.country === user?.country)
    : sortedLeaderboard;

  const getPositionIcon = (position) => {
    if (position === 1) return '🥇';
    if (position === 2) return '🥈';
    if (position === 3) return '🥉';
    return `#${position}`;
  };

  const getPositionColor = (position) => {
    if (position === 1) return 'text-yellow-400';
    if (position === 2) return 'text-gray-300';
    if (position === 3) return 'text-orange-400';
    return 'text-gray-400';
  };

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
              <SafeIcon icon={FiTrophy} className="w-8 h-8 text-yellow-400" />
              <h1 className="text-3xl font-bold text-white">Leaderboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-dark-800 border border-dark-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="global">🌍 Global</option>
                <option value="country">🏁 My Country</option>
              </select>
              <select
                value={timeFrame}
                onChange={(e) => setTimeFrame(e.target.value)}
                className="bg-dark-800 border border-dark-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Time</option>
                <option value="month">This Month</option>
                <option value="week">This Week</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Top 3 Podium */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredLeaderboard.slice(0, 3).map((player, index) => (
              <div
                key={player.id}
                className={`bg-dark-800 rounded-xl p-6 border-2 ${
                  index === 0 ? 'border-yellow-400' : 
                  index === 1 ? 'border-gray-300' : 
                  'border-orange-400'
                } ${player.username === user?.username ? 'ring-2 ring-primary-500' : ''}`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">{getPositionIcon(index + 1)}</div>
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                    {getCountryFlag(player.country)}
                  </div>
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <span className={`text-sm font-medium ${getRankColor(player.rank)}`}>
                      {player.rank}
                    </span>
                    {player.username === user?.username && (
                      <span className="text-xs bg-primary-600 text-white px-2 py-1 rounded-full">You</span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{player.username}</h3>
                  <p className="text-sm text-gray-400 mb-3">{player.country}</p>
                  <div className="bg-dark-700 rounded-lg p-3">
                    <div className="text-2xl font-bold text-white mb-1">{player.points}</div>
                    <div className="text-xs text-gray-400">Points</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Full Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden"
        >
          <div className="p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              {filterType === 'global' ? 'Global Rankings' : `${user?.country} Rankings`}
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-700">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Rank</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Player</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Country</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Level</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Points</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">W/L</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Win Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeaderboard.map((player, index) => (
                    <motion.tr
                      key={player.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`border-b border-dark-700 hover:bg-dark-700 transition-colors ${
                        player.username === user?.username ? 'bg-primary-900/20' : ''
                      }`}
                    >
                      <td className="py-4 px-4">
                        <span className={`text-lg font-bold ${getPositionColor(index + 1)}`}>
                          {getPositionIcon(index + 1)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-sm">
                            {getCountryFlag(player.country)}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-white">{player.username}</span>
                              {player.username === user?.username && (
                                <span className="text-xs bg-primary-600 text-white px-2 py-1 rounded-full">You</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-300">{player.country}</td>
                      <td className="py-4 px-4">
                        <span className={`font-medium ${getRankColor(player.rank)}`}>
                          {player.rank}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-white font-bold">{player.points}</td>
                      <td className="py-4 px-4 text-gray-300">{player.wins}/{player.losses}</td>
                      <td className="py-4 px-4">
                        <span className="text-green-400 font-medium">
                          {player.wins + player.losses > 0 
                            ? Math.round((player.wins / (player.wins + player.losses)) * 100) + '%'
                            : '0%'
                          }
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Ad Space */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xl font-bold mb-2">🎮 Rank Boost Service</h4>
              <p className="text-indigo-100 mb-4">
                Get personalized coaching from top players and climb the leaderboard faster!
              </p>
              <button className="bg-white text-indigo-600 font-medium py-2 px-6 rounded-lg hover:bg-gray-100 transition-colors">
                Get Coaching
              </button>
            </div>
            <div className="text-6xl opacity-20">
              🚀
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Leaderboard;