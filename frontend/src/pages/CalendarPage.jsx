import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const CalendarPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data.data);
    } catch (err) {
      toast.error('Failed to load tasks for calendar');
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const prevMonth = () => setCurrentDate(new Date(year, currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, currentDate.getMonth() + 1, 1));

  const renderCells = () => {
    const cells = [];
    // Empty cells before the 1st
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="p-2 border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 min-h-[120px]"></div>);
    }
    
    // Days
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDayString = new Date(year, currentDate.getMonth(), day).toISOString().split('T')[0];
      
      const dayTasks = tasks.filter(task => {
        if (!task.dueDate) return false;
        const taskDateString = new Date(task.dueDate).toISOString().split('T')[0];
        return taskDateString === currentDayString;
      });

      const isToday = currentDayString === new Date().toISOString().split('T')[0];

      cells.push(
        <div key={day} className={`p-2 border border-gray-100 dark:border-gray-800 min-h-[120px] transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 relative ${isToday ? 'bg-blue-50/30 dark:bg-blue-900/10 ring-1 ring-inset ring-primary' : 'bg-white dark:bg-gray-900'}`}>
          <div className="flex justify-between items-start mb-2">
            <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-primary text-white shadow-md' : 'text-gray-700 dark:text-gray-300'}`}>{day}</span>
          </div>
          <div className="space-y-1 overflow-y-auto max-h-[80px] scrollbar-hide">
            {dayTasks.map(task => (
              <div key={task._id} className={`text-xs px-2 py-1 rounded truncate font-medium cursor-pointer transition-transform hover:scale-[1.02] ${task.priority === 'Critical' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : task.priority === 'High' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`} title={task.title}>
                {task.title}
              </div>
            ))}
          </div>
        </div>
      );
    }
    return cells;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-12">
      <div className="flex justify-between items-center bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white tracking-tight">Calendar</h2>
          <p className="text-gray-500 mt-1">Visually track task deadlines and upcoming milestones.</p>
        </div>
        <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 p-2 rounded-xl border border-gray-100 dark:border-gray-700">
          <button onClick={prevMonth} className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors"><ChevronLeft size={20} /></button>
          <span className="font-bold w-36 text-center text-gray-800 dark:text-white">{monthName} {year}</span>
          <button onClick={nextMonth} className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors"><ChevronRight size={20} /></button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-24"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
        ) : (
          <div>
            <div className="grid grid-cols-7 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {renderCells()}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CalendarPage;
