import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, MessageSquare, Tag, AlignLeft, Activity } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const TaskDetailsModal = ({ taskId, onClose }) => {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    fetchTaskDetails();
  }, [taskId]);

  const fetchTaskDetails = async () => {
    try {
      const res = await api.get(`/tasks/${taskId}`);
      setTask(res.data.data);
    } catch (err) {
      toast.error('Failed to load task details');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await api.put(`/tasks/${taskId}`, { newComment });
      setNewComment('');
      fetchTaskDetails(); // Refresh
      toast.success('Comment added');
    } catch (err) {
      toast.error('Failed to add comment');
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!task) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60] animate-fade-in" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 rounded-t-2xl">
          <div className="flex items-center gap-4">
            <span className={`px-3 py-1 rounded text-xs font-bold uppercase ${task.status === 'Completed' ? 'bg-green-100 text-green-700' : task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {task.status}
            </span>
            <span className={`px-3 py-1 rounded text-xs font-bold uppercase ${task.priority === 'Critical' ? 'bg-red-100 text-red-700' : task.priority === 'High' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
              {task.priority} Priority
            </span>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors">
            ✕
          </button>
        </div>

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Main Content Area */}
          <div className="w-full md:w-2/3 p-6 overflow-y-auto border-r border-gray-100 dark:border-gray-800">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">{task.title}</h2>
            
            <div className="mb-8">
              <h4 className="flex items-center font-bold text-gray-700 dark:text-gray-300 mb-3"><AlignLeft size={18} className="mr-2" /> Description</h4>
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl text-gray-600 dark:text-gray-400 text-sm leading-relaxed whitespace-pre-wrap">
                {task.description}
              </div>
            </div>

            <div className="mb-8">
              <h4 className="flex items-center font-bold text-gray-700 dark:text-gray-300 mb-3"><MessageSquare size={18} className="mr-2" /> Activity & Comments</h4>
              
              <div className="space-y-4 mb-4 max-h-[300px] overflow-y-auto pr-2">
                {task.comments?.length === 0 && <p className="text-sm text-gray-500 italic">No comments yet.</p>}
                {task.comments?.map(comment => (
                  <div key={comment._id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">U</div>
                    <div className="bg-gray-50 dark:bg-gray-800/80 p-3 rounded-xl rounded-tl-none flex-1">
                      <p className="text-xs font-bold text-gray-800 dark:text-gray-200 mb-1">User <span className="text-gray-400 font-normal text-[10px] ml-2">{new Date(comment.date).toLocaleString()}</span></p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddComment} className="mt-4">
                <textarea value={newComment} onChange={e=>setNewComment(e.target.value)} placeholder="Write a comment..." className="w-full p-3 border dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary outline-none dark:bg-gray-900 text-sm min-h-[80px]" />
                <div className="flex justify-end mt-2">
                  <button type="submit" disabled={!newComment.trim()} className="bg-primary text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors">Save Comment</button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="w-full md:w-1/3 p-6 bg-gray-50/50 dark:bg-gray-800/20 overflow-y-auto">
            <h4 className="font-bold text-gray-900 dark:text-white mb-4 uppercase text-xs tracking-wider">Details</h4>
            
            <div className="space-y-5">
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Category</p>
                <div className="flex items-center"><Tag size={14} className="text-gray-400 mr-2"/> <span className="text-sm font-medium dark:text-gray-300">{task.category || 'General'}</span></div>
              </div>
              
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Due Date</p>
                <div className="flex items-center"><Clock size={14} className="text-gray-400 mr-2"/> <span className="text-sm font-medium dark:text-gray-300">{new Date(task.dueDate).toLocaleDateString()}</span></div>
              </div>

              <div>
                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Tags</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {task.tags?.length > 0 ? task.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-xs rounded-md font-medium">{tag}</span>
                  )) : <span className="text-sm text-gray-400">None</span>}
                </div>
              </div>

              <hr className="border-gray-200 dark:border-gray-700" />

              <div>
                <p className="text-xs text-gray-500 font-bold uppercase mb-3 flex items-center"><Activity size={14} className="mr-1"/> History</p>
                <div className="space-y-3">
                  {task.history?.map((hist, i) => (
                    <div key={i} className="relative pl-4 border-l-2 border-gray-200 dark:border-gray-700 pb-1">
                      <div className="absolute w-2 h-2 bg-primary rounded-full -left-[5px] top-1"></div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">{hist.action}</p>
                      <p className="text-[10px] text-gray-400">{new Date(hist.date).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;
