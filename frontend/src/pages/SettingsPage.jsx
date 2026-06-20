import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Shield, Bell, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

const SettingsPage = ({ darkMode, setDarkMode }) => {
  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Settings saved successfully');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white tracking-tight flex items-center"><Settings className="mr-3" size={28} /> Global Settings</h2>
        <p className="text-gray-500 mt-2">Manage your workspace preferences, appearance, and notifications.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 border-b pb-4 dark:border-gray-800">Appearance</h3>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <div>
              <p className="font-bold text-gray-800 dark:text-white">Dark Mode</p>
              <p className="text-sm text-gray-500">Toggle dark theme for the entire workspace.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 border-b pb-4 dark:border-gray-800 flex items-center"><Bell className="mr-2" size={20} /> Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <div>
                <p className="font-bold text-gray-800 dark:text-white">Email Alerts</p>
                <p className="text-sm text-gray-500">Receive emails when assigned a new task.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <div>
                <p className="font-bold text-gray-800 dark:text-white">Deadline Warnings</p>
                <p className="text-sm text-gray-500">System alerts 24 hours before deadline.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 border-b pb-4 dark:border-gray-800 flex items-center"><Shield className="mr-2" size={20} /> Security</h3>
          <div className="space-y-4">
            <button type="button" className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <div className="flex items-center text-left">
                <Lock className="text-gray-400 mr-4" size={20} />
                <div>
                  <p className="font-bold text-gray-800 dark:text-white">Change Password</p>
                  <p className="text-sm text-gray-500">Update your account password securely.</p>
                </div>
              </div>
              <span className="text-primary font-bold text-sm">Update</span>
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" className="bg-primary hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-lg">
            Save Preferences
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default SettingsPage;
