import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Edit, Trash2, Eye } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import TaskDetailsModal from '../components/TaskDetailsModal';

const TasksTable = ({ defaultStatusFilter = 'All' }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [statusFilter, setStatusFilter] = useState(defaultStatusFilter);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data.data);
    } catch (err) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this task?")) {
      try {
        await api.delete(`/tasks/${id}`);
        toast.success("Task deleted");
        fetchTasks();
      } catch (err) {
        toast.error("Failed to delete task");
      }
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white tracking-tight">Task Directory</h2>
          <p className="text-gray-500 mt-1">Manage and track all your team's tasks in one place.</p>
        </div>
        <button className="bg-primary hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all">
          + Create Task
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex flex-wrap gap-4 items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
          <div className="flex items-center bg-white dark:bg-gray-800 px-3 py-2 rounded-lg border dark:border-gray-700 w-72 focus-within:border-primary transition-colors">
            <Search size={18} className="text-gray-400 mr-2" />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none w-full text-sm dark:text-white"
            />
          </div>
          <div className="flex gap-2 text-sm font-semibold">
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors outline-none cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Review">Review</option>
              <option value="Completed">Completed</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Sort
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600 dark:text-gray-400">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 font-bold">Task Title</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold">Priority</th>
                <th className="px-6 py-4 font-bold">Due Date</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div></td></tr>
              ) : filteredTasks.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center">No tasks found.</td></tr>
              ) : (
                filteredTasks.map((task) => (
                  <tr key={task._id} className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {task.title}
                      <div className="text-xs text-gray-400 font-normal truncate max-w-xs mt-1">{task.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${task.status === 'Completed' ? 'bg-green-100 text-green-700' : task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${task.priority === 'Critical' ? 'bg-red-100 text-red-700' : task.priority === 'High' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-400 hover:text-primary mx-1 transition-colors"><Eye size={18} /></button>
                      <button className="text-gray-400 hover:text-secondary mx-1 transition-colors"><Edit size={18} /></button>
                      <button className="text-gray-400 hover:text-danger mx-1 transition-colors"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default TasksTable;
