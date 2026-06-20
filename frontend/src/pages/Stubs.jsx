import React from 'react';
import { motion } from 'framer-motion';

export const Calendar = () => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
    <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Calendar</h2>
    <div className="glass p-8 h-[60vh] rounded-2xl flex flex-col items-center justify-center border-t-4 border-primary">
      <p className="text-xl text-gray-500">A beautiful full-page interactive calendar mapping to your tasks is rendering here.</p>
    </div>
  </motion.div>
);

export const Reports = () => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Automated Reports</h2>
      <button className="bg-primary text-white px-4 py-2 rounded-lg font-bold">Export PDF</button>
    </div>
    <div className="glass p-8 h-[60vh] rounded-2xl flex flex-col items-center justify-center border-t-4 border-secondary">
      <p className="text-xl text-gray-500">Your generated Excel and PDF productivity reports will appear here.</p>
    </div>
  </motion.div>
);

export const Team = () => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Team Management</h2>
      <button className="bg-primary text-white px-4 py-2 rounded-lg font-bold">+ Invite Member</button>
    </div>
    <div className="glass p-8 h-[60vh] rounded-2xl flex flex-col items-center justify-center border-t-4 border-accent">
      <p className="text-xl text-gray-500">Assign roles and manage team workloads in this workspace.</p>
    </div>
  </motion.div>
);

export const Notifications = () => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
    <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Notification Center</h2>
    <div className="glass p-8 h-[60vh] rounded-2xl flex flex-col items-center justify-center border-t-4 border-warning">
      <p className="text-xl text-gray-500">You have 0 unread alerts regarding approaching deadlines.</p>
    </div>
  </motion.div>
);

export const Settings = () => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
    <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Enterprise Settings</h2>
    <div className="glass p-8 h-[60vh] rounded-2xl flex flex-col items-center justify-center border-t-4 border-danger">
      <p className="text-xl text-gray-500">Configure global preferences, security, and two-factor authentication.</p>
    </div>
  </motion.div>
);
