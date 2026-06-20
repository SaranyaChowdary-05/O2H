import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const CreateTaskPage = () => {
  const navigate = useNavigate();
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '', priority: 'Medium', status: 'Pending', category: 'General' });

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', newTask);
      toast.success('Task created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating task");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto space-y-6 pb-12">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white tracking-tight mb-2">Create New Task</h2>
        <p className="text-gray-500 mb-8">Add a new task to your workspace, assign priorities, and set a due date.</p>
        
        <form onSubmit={handleCreateTask} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Task Title <span className="text-red-500">*</span></label>
            <input type="text" required value={newTask.title} onChange={e=>setNewTask({...newTask, title: e.target.value})} className="w-full p-3 border dark:border-gray-700 dark:bg-gray-800 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-shadow text-gray-800 dark:text-white" placeholder="e.g. Design Landing Page" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Description <span className="text-red-500">*</span></label>
            <textarea required minLength={20} value={newTask.description} onChange={e=>setNewTask({...newTask, description: e.target.value})} className="w-full p-3 border dark:border-gray-700 dark:bg-gray-800 rounded-xl focus:ring-2 focus:ring-primary outline-none h-32 transition-shadow text-gray-800 dark:text-white" placeholder="Detailed description (minimum 20 characters)" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Status</label>
              <select value={newTask.status} onChange={e=>setNewTask({...newTask, status: e.target.value})} className="w-full p-3 border dark:border-gray-700 dark:bg-gray-800 rounded-xl focus:ring-2 focus:ring-primary outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-white cursor-pointer">
                <option>Pending</option>
                <option>In Progress</option>
                <option>Review</option>
                <option>Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Priority</label>
              <select value={newTask.priority} onChange={e=>setNewTask({...newTask, priority: e.target.value})} className="w-full p-3 border dark:border-gray-700 dark:bg-gray-800 rounded-xl focus:ring-2 focus:ring-primary outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-white cursor-pointer">
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Category</label>
              <select value={newTask.category} onChange={e=>setNewTask({...newTask, category: e.target.value})} className="w-full p-3 border dark:border-gray-700 dark:bg-gray-800 rounded-xl focus:ring-2 focus:ring-primary outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-white cursor-pointer">
                <option>General</option>
                <option>Development</option>
                <option>Design</option>
                <option>Marketing</option>
                <option>Sales</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Due Date <span className="text-red-500">*</span></label>
              <input type="date" required value={newTask.dueDate} onChange={e=>setNewTask({...newTask, dueDate: e.target.value})} className="w-full p-3 border dark:border-gray-700 dark:bg-gray-800 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-shadow text-gray-800 dark:text-white" />
            </div>
          </div>
          
          <div className="flex justify-end pt-6 border-t dark:border-gray-800 mt-8 gap-4">
            <button type="button" onClick={() => navigate('/dashboard')} className="px-6 py-3 font-semibold text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors">Cancel</button>
            <button type="submit" className="px-8 py-3 font-bold bg-primary text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg">Create Task</button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default CreateTaskPage;
