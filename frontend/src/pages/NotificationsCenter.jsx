import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Check, Trash2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const NotificationsCenter = () => {
  // In a real app this would fetch from /api/notifications. For phase 2 we mock the UI with state to show the layout working.
  const [notifications, setNotifications] = useState([
    { _id: '1', message: 'Task "Design Landing Page" was marked as Completed', date: new Date().toISOString(), read: false, type: 'success' },
    { _id: '2', message: 'You were assigned to "Backend API Integration"', date: new Date(Date.now() - 86400000).toISOString(), read: false, type: 'info' },
    { _id: '3', message: 'Deadline approaching for "Deploy to Vercel" in 2 days!', date: new Date(Date.now() - 172800000).toISOString(), read: true, type: 'warning' },
  ]);

  const markRead = (id) => {
    setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
    toast.success('Marked as read');
  };

  const deleteNotif = (id) => {
    setNotifications(notifications.filter(n => n._id !== id));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex justify-between items-center bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white tracking-tight">Notification Center</h2>
          <p className="text-gray-500 mt-1">Stay updated on task assignments, deadlines, and team activity.</p>
        </div>
        <div className="relative">
          <Bell size={32} className="text-gray-400" />
          <span className="absolute top-0 right-0 w-3 h-3 bg-danger rounded-full border-2 border-white dark:border-gray-900"></span>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        {notifications.length === 0 ? (
          <div className="text-center py-16">
            <Bell size={48} className="mx-auto text-gray-300 mb-4" />
            <h4 className="text-xl font-bold text-gray-500">All caught up!</h4>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {notifications.map((notif) => (
              <div key={notif._id} className={`p-6 flex items-start justify-between transition-colors ${notif.read ? 'bg-white dark:bg-gray-900' : 'bg-blue-50/50 dark:bg-blue-900/10'}`}>
                <div className="flex gap-4">
                  <div className={`mt-1 w-2.5 h-2.5 rounded-full ${notif.read ? 'bg-transparent' : 'bg-primary'}`}></div>
                  <div>
                    <p className={`text-gray-800 dark:text-gray-200 ${notif.read ? 'font-medium' : 'font-bold'}`}>{notif.message}</p>
                    <p className="text-xs text-gray-400 mt-2 font-medium">{new Date(notif.date).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!notif.read && (
                    <button onClick={() => markRead(notif._id)} className="p-2 text-primary hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors" title="Mark as read">
                      <Check size={18} />
                    </button>
                  )}
                  <button onClick={() => deleteNotif(notif._id)} className="p-2 text-gray-400 hover:text-danger hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors" title="Delete">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default NotificationsCenter;
