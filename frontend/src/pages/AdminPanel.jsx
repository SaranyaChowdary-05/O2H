import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Activity, Settings, Database, Server } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AdminPanel = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalTasks: 0, completedTasks: 0, recentLogs: [] });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users')
      ]);
      setStats(statsRes.data.data);
      setUsers(usersRes.data.data);
    } catch (err) {
      toast.error('Failed to load admin panel data. Verify your role is Admin.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-24"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-12">
      <div className="flex justify-between items-center bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="flex items-center">
          <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl mr-4"><Shield size={28} /></div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white tracking-tight">Admin Control Panel</h2>
            <p className="text-gray-500 mt-1">System monitoring, audit logs, and user management.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-2xl border-t-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Users</p>
              <h3 className="text-3xl font-black mt-2 text-gray-800 dark:text-white">{stats.totalUsers}</h3>
            </div>
            <Users size={40} className="text-blue-200 dark:text-blue-900/50" />
          </div>
        </div>
        <div className="glass p-6 rounded-2xl border-t-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Tasks</p>
              <h3 className="text-3xl font-black mt-2 text-gray-800 dark:text-white">{stats.totalTasks}</h3>
            </div>
            <Database size={40} className="text-green-200 dark:text-green-900/50" />
          </div>
        </div>
        <div className="glass p-6 rounded-2xl border-t-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">System Health</p>
              <h3 className="text-3xl font-black mt-2 text-green-500">99.9%</h3>
            </div>
            <Server size={40} className="text-purple-200 dark:text-purple-900/50" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Management */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-4 mb-4">
            <h3 className="text-lg font-bold flex items-center"><Settings className="mr-2" size={20} /> User Management</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-gray-500 border-b dark:border-gray-800">
                  <th className="pb-3 font-semibold">User</th>
                  <th className="pb-3 font-semibold">Email</th>
                  <th className="pb-3 font-semibold">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} className="border-b dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="py-3 font-medium text-gray-900 dark:text-gray-100">{u.name}</td>
                    <td className="py-3 text-gray-500">{u.email}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${u.role === 'Admin' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>{u.role || 'User'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Logs */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-4 mb-4">
            <h3 className="text-lg font-bold flex items-center"><Activity className="mr-2" size={20} /> System Audit Logs</h3>
          </div>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
            {stats.recentLogs.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No recent activity logs.</p>
            ) : (
              stats.recentLogs.map(log => (
                <div key={log._id} className="flex gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <div className="mt-1"><Activity size={16} className="text-primary" /></div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{log.action}</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(log.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminPanel;
