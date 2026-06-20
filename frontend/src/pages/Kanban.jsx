import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, MoreHorizontal } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import TaskDetailsModal from '../components/TaskDetailsModal';

const Kanban = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draggedTask, setDraggedTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  const columns = ['Backlog', 'Pending', 'In Progress', 'Review', 'Completed'];

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data.data);
    } catch (err) {
      toast.error('Failed to load board');
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    // Make it look transparent while dragging
    setTimeout(() => { e.target.classList.add('opacity-50'); }, 0);
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove('opacity-50');
    setDraggedTask(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    if (!draggedTask) return;
    
    // Optimistic UI update
    if (draggedTask.status !== targetStatus) {
      const updatedTasks = tasks.map(t => t._id === draggedTask._id ? { ...t, status: targetStatus } : t);
      setTasks(updatedTasks);
      
      try {
        await api.put(`/tasks/${draggedTask._id}`, { status: targetStatus });
        toast.success(`Moved to ${targetStatus}`);
        fetchTasks(); // Background sync
      } catch (err) {
        toast.error('Failed to update status');
        fetchTasks(); // Revert on failure
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="h-full flex flex-col pb-12">
      <div className="flex justify-between items-center bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white tracking-tight">Agile Kanban Board</h2>
          <p className="text-gray-500 mt-1">Drag and drop tasks across columns to update their progress.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-24"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
      ) : (
        <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
          <div className="flex gap-6 min-w-max h-full items-start px-2">
            {columns.map(status => {
              const columnTasks = tasks.filter(t => t.status === status);
              const headerColor = status === 'Completed' ? 'bg-green-500' : status === 'In Progress' ? 'bg-primary' : status === 'Review' ? 'bg-secondary' : 'bg-gray-400';

              return (
                <div 
                  key={status}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, status)}
                  className="w-[320px] bg-white/40 dark:bg-[#0a0f1c]/40 backdrop-blur-md rounded-3xl border border-white/60 dark:border-gray-800/50 flex flex-col h-[75vh] flex-shrink-0 shadow-xl shadow-blue-900/5"
                >
                  <div className="p-5 flex justify-between items-center border-b border-gray-200/50 dark:border-gray-800/50">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${headerColor} shadow-md`}></div>
                      <h3 className="font-bold text-gray-800 dark:text-gray-100">{status}</h3>
                      <span className="bg-white/60 dark:bg-gray-800/60 text-gray-600 dark:text-gray-300 text-xs px-2.5 py-1 rounded-full font-bold shadow-sm">{columnTasks.length}</span>
                    </div>
                    <button className="text-gray-400 hover:text-gray-900 dark:hover:text-white bg-white/50 dark:bg-gray-800/50 p-1.5 rounded-lg transition-colors"><MoreHorizontal size={18} /></button>
                  </div>
                  
                  <div className="p-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
                    {columnTasks.map(task => (
                      <div
                        key={task._id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task)}
                        onDragEnd={handleDragEnd}
                        onClick={() => setSelectedTask(task._id)}
                        className="bg-white/80 dark:bg-[#111]/80 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-white dark:border-gray-700 cursor-grab active:cursor-grabbing hover:shadow-md hover:-translate-y-1 hover:border-primary/30 transition-all group"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${task.priority === 'Critical' ? 'bg-red-100 text-red-700' : task.priority === 'High' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'}`}>
                            {task.priority}
                          </span>
                        </div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm leading-tight group-hover:text-primary transition-colors">{task.title}</h4>
                        
                        <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                          <span className="text-[10px] font-bold text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg">{task.category || 'General'}</span>
                          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white text-[10px] font-bold shadow-sm">U</div>
                        </div>
                      </div>
                    ))}
                    
                    <button className="w-full py-3 flex items-center justify-center text-sm font-semibold text-gray-500 hover:text-primary hover:bg-white/80 dark:hover:bg-gray-800 dark:hover:text-white rounded-2xl transition-all border border-dashed border-gray-300 dark:border-gray-700">
                      <Plus size={16} className="mr-2" /> Add Task
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {selectedTask && <TaskDetailsModal taskId={selectedTask} onClose={() => setSelectedTask(null)} />}
    </motion.div>
  );
};

export default Kanban;
