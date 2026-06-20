import React, { useContext, useEffect, useState, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { CheckCircle, Clock, AlertCircle, Plus, Trash2, Check, Search, Filter, Edit, Eye, ListTodo } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import toast, { Toaster } from 'react-hot-toast';
import TaskDetailsModal from '../components/TaskDetailsModal';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, inProgress: 0, overdue: 0 });
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '', priority: 'Medium', status: 'Pending' });
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    if (!user) navigate('/login');
    else fetchTasks();
  }, [user, navigate]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await api.get('/tasks');
      const data = response.data.data;
      setTasks(data);
      calculateStats(data);
    } catch (error) {
      toast.error("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const today = new Date();
    setStats({
      total: data.length,
      completed: data.filter(t => t.status === 'Completed').length,
      pending: data.filter(t => t.status === 'Pending').length,
      inProgress: data.filter(t => t.status === 'In Progress').length,
      overdue: data.filter(t => new Date(t.dueDate) < today && t.status !== 'Completed').length,
    });
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', newTask);
      toast.success('Task created successfully!');
      setShowModal(false);
      setNewTask({ title: '', description: '', dueDate: '', priority: 'Medium', status: 'Pending' });
      fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating task");
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/tasks/${id}`, { status });
      toast.success(`Task marked as ${status}`);
      fetchTasks();
    } catch (error) {
      toast.error("Error updating task");
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await api.delete(`/tasks/${id}`);
        toast.success('Task deleted');
        fetchTasks();
      } catch (error) {
        toast.error("Error deleting task");
      }
    }
  };

  // Process data for rendering
  const filteredTasks = useMemo(() => {
    let result = tasks;
    if (searchTerm) result = result.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()));
    if (filterStatus !== 'All') result = result.filter(t => t.status === filterStatus);
    if (filterPriority !== 'All') result = result.filter(t => t.priority === filterPriority);
    
    result.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'due-soon') return new Date(a.dueDate) - new Date(b.dueDate);
      return 0;
    });
    return result;
  }, [tasks, searchTerm, filterStatus, filterPriority, sortBy]);

  const pieData = [
    { name: 'Completed', value: stats.completed, color: '#10B981' },
    { name: 'In Progress', value: stats.inProgress, color: '#3B82F6' },
    { name: 'Pending', value: stats.pending, color: '#F59E0B' },
  ];

  if (!user) return null;

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      <Toaster position="top-right" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center glass p-8 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-3xl font-bold">Welcome back, {user.name}</h2>
          <p className="text-gray-500 mt-1">Here is your professional dashboard overview.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="mt-4 md:mt-0 flex items-center bg-primary text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 font-semibold">
          <Plus size={20} className="mr-2" /> New Task
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass p-6 rounded-2xl flex items-center border-l-4 border-primary hover:shadow-md transition-all">
          <div className="p-4 bg-blue-100 text-blue-600 rounded-xl mr-5"><ListTodo size={28} /></div>
          <div><p className="text-sm text-gray-500 uppercase font-bold tracking-wider">Total</p><p className="text-3xl font-black text-gray-800">{stats.total}</p></div>
        </div>
        <div className="glass p-6 rounded-2xl flex items-center border-l-4 border-green-500 hover:shadow-md transition-all">
          <div className="p-4 bg-green-100 text-green-600 rounded-xl mr-5"><CheckCircle size={28} /></div>
          <div><p className="text-sm text-gray-500 uppercase font-bold tracking-wider">Completed</p><p className="text-3xl font-black text-gray-800">{stats.completed}</p></div>
        </div>
        <div className="glass p-6 rounded-2xl flex items-center border-l-4 border-yellow-500 hover:shadow-md transition-all">
          <div className="p-4 bg-yellow-100 text-yellow-600 rounded-xl mr-5"><Clock size={28} /></div>
          <div><p className="text-sm text-gray-500 uppercase font-bold tracking-wider">Pending</p><p className="text-3xl font-black text-gray-800">{stats.pending}</p></div>
        </div>
        <div className="glass p-6 rounded-2xl flex items-center border-l-4 border-red-500 hover:shadow-md transition-all">
          <div className="p-4 bg-red-100 text-red-600 rounded-xl mr-5"><AlertCircle size={28} /></div>
          <div><p className="text-sm text-gray-500 uppercase font-bold tracking-wider">Overdue</p><p className="text-3xl font-black text-gray-800">{stats.overdue}</p></div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-6 rounded-2xl h-80 flex flex-col">
          <h3 className="text-lg font-bold mb-4">Task Status Distribution</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <RechartsTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="glass p-6 rounded-2xl flex flex-col justify-center">
          <h3 className="text-lg font-bold mb-6">Completion Progress</h3>
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-gray-700">Overall Completion Rate</span>
              <span className="font-bold text-primary">{stats.total ? Math.round((stats.completed / stats.total) * 100) : 0}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-secondary h-4 rounded-full transition-all duration-1000" style={{ width: `${stats.total ? (stats.completed / stats.total) * 100 : 0}%` }}></div>
            </div>
          </div>
          <p className="text-gray-500 mt-4 text-sm">Keep up the great work! You have completed {stats.completed} out of {stats.total} tasks so far.</p>
        </div>
      </div>

      {/* Task List Section */}
      <div className="glass p-6 rounded-2xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 border-b pb-4">
          <h3 className="text-xl font-bold">Your Tasks</h3>
          
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
              <input type="text" placeholder="Search tasks..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none text-sm w-full md:w-64" />
            </div>
            <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} className="px-4 py-2 border rounded-lg text-sm outline-none cursor-pointer">
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <select value={filterPriority} onChange={e=>setFilterPriority(e.target.value)} className="px-4 py-2 border rounded-lg text-sm outline-none cursor-pointer">
              <option value="All">All Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
            <select value={sortBy} onChange={e=>setSortBy(e.target.value)} className="px-4 py-2 border rounded-lg text-sm outline-none cursor-pointer">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="due-soon">Due Soonest</option>
            </select>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <ListTodo size={48} className="mx-auto text-gray-400 mb-4" />
            <h4 className="text-lg font-bold text-gray-700">No tasks found</h4>
            <p className="text-gray-500 mt-2">Adjust your filters or create a new task to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map(task => (
              <div key={task._id} className="p-5 border rounded-xl hover:shadow-lg transition-all flex flex-col md:flex-row justify-between items-start md:items-center bg-white group">
                <div className="mb-4 md:mb-0 max-w-2xl">
                  <div className="flex items-center mb-1">
                    <h4 className={`font-bold text-lg ${task.status === 'Completed' ? 'text-gray-400 line-through' : 'text-gray-800'}`}>{task.title}</h4>
                    <span className={`ml-3 px-2.5 py-0.5 rounded-full text-xs font-bold ${task.priority === 'Critical' ? 'bg-red-100 text-red-700' : task.priority === 'High' ? 'bg-orange-100 text-orange-700' : task.priority === 'Medium' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>{task.priority}</span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
                  <div className="flex gap-4 mt-3 text-xs text-gray-500 font-medium">
                    <span className="flex items-center"><Clock size={14} className="mr-1"/> Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                    <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center w-full md:w-auto justify-between md:justify-end gap-4">
                  <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${task.status === 'Completed' ? 'bg-green-100 text-green-700' : task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {task.status}
                  </span>
                  
                  <div className="flex space-x-2">
                    {task.status !== 'Completed' && (
                      <button onClick={() => handleUpdateStatus(task._id, 'Completed')} className="p-2 bg-gray-50 text-green-600 rounded-lg hover:bg-green-100 transition shadow-sm border" title="Mark as complete"><Check size={18} /></button>
                    )}
                    <button onClick={() => setSelectedTask(task._id)} className="p-2 bg-gray-50 text-blue-600 rounded-lg hover:bg-blue-100 transition shadow-sm border" title="View details"><Eye size={18} /></button>
                    <button className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-200 transition shadow-sm border" title="Edit task"><Edit size={18} /></button>
                    <button onClick={() => handleDeleteTask(task._id)} className="p-2 bg-gray-50 text-red-600 rounded-lg hover:bg-red-100 transition shadow-sm border" title="Delete task"><Trash2 size={18} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedTask && <TaskDetailsModal taskId={selectedTask} onClose={() => setSelectedTask(null)} />}

      {/* Create Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6 pb-4 border-b">
              <h3 className="text-2xl font-bold text-gray-800">Create New Task</h3>
            </div>
            <form onSubmit={handleCreateTask} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Task Title <span className="text-red-500">*</span></label>
                <input type="text" required value={newTask.title} onChange={e=>setNewTask({...newTask, title: e.target.value})} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-shadow" placeholder="e.g. Design Landing Page" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
                <textarea required minLength={20} value={newTask.description} onChange={e=>setNewTask({...newTask, description: e.target.value})} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-primary outline-none h-28 transition-shadow" placeholder="Detailed description (minimum 20 characters)" />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
                  <select value={newTask.status} onChange={e=>setNewTask({...newTask, status: e.target.value})} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-primary outline-none bg-white cursor-pointer transition-shadow">
                    <option>Pending</option>
                    <option>In Progress</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Priority</label>
                  <select value={newTask.priority} onChange={e=>setNewTask({...newTask, priority: e.target.value})} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-primary outline-none bg-white cursor-pointer transition-shadow">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Due Date <span className="text-red-500">*</span></label>
                <input type="date" required value={newTask.dueDate} onChange={e=>setNewTask({...newTask, dueDate: e.target.value})} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-shadow" />
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2.5 font-semibold bg-primary text-white rounded-xl hover:bg-blue-700 transition-colors shadow-md">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
