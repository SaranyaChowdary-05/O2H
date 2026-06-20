import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Shield, UserPlus, MoreVertical, Trash2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const TeamManagement = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('User');

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const res = await api.get('/team');
      setMembers(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load team data');
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      await api.post('/team', { email, role });
      toast.success('Member invited successfully!');
      setShowInvite(false);
      fetchTeam();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error inviting member');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-12">
      <div className="flex justify-between items-center bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white tracking-tight">Team Directory</h2>
          <p className="text-gray-500 mt-1">Manage organizational roles, view productivity, and invite members.</p>
        </div>
        <button onClick={() => setShowInvite(true)} className="bg-primary hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all flex items-center">
          <UserPlus size={20} className="mr-2" /> Invite Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 text-center py-12"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div></div>
        ) : members.length === 0 ? (
          <div className="col-span-3 text-center py-16 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
            <Shield size={48} className="mx-auto text-gray-400 mb-4" />
            <h4 className="text-xl font-bold text-gray-700 dark:text-gray-300">No team members yet</h4>
            <p className="text-gray-500 mt-2">Start collaborating by inviting users to your workspace.</p>
          </div>
        ) : (
          members.map((member) => (
            <div key={member._id} className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow relative group">
              <button className="absolute top-4 right-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-danger">
                <Trash2 size={18} />
              </button>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white text-2xl font-bold shadow-md">
                  {member.user?.name?.charAt(0) || '?'}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{member.user?.name || 'Unknown User'}</h3>
                  <p className="text-sm text-gray-500 flex items-center mt-0.5"><Mail size={14} className="mr-1" /> {member.user?.email || 'No email'}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <span className={`px-3 py-1 text-xs font-bold rounded-lg uppercase ${member.teamRole === 'Admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                  {member.teamRole}
                </span>
                <span className="text-xs text-gray-400 font-medium">Joined {new Date(member.joinedAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {showInvite && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Invite Team Member</h3>
            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">User Email</label>
                <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="They must be registered in the system" className="w-full p-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Team Role</label>
                <select value={role} onChange={e=>setRole(e.target.value)} className="w-full p-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-primary outline-none cursor-pointer">
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setShowInvite(false)} className="px-5 py-2.5 font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2.5 font-semibold bg-primary text-white rounded-xl hover:bg-blue-700 transition-colors shadow-md">Send Invite</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TeamManagement;
