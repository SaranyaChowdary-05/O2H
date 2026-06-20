import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  LayoutDashboard, ListTodo, PlusSquare, Layout, CalendarDays, 
  BarChart3, FileText, Users, Bell, User, Settings, LogOut, Sun, Moon,
  CheckCircle, Clock, AlertCircle, Shield
} from 'lucide-react';

const Sidebar = ({ darkMode, setDarkMode }) => {
  const { logout, user } = useContext(AuthContext);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'All Tasks', path: '/tasks-table', icon: <ListTodo size={20} /> },
    { name: 'Create Task', path: '/add-task', icon: <PlusSquare size={20} /> },
    { name: 'My Tasks', path: '/my-tasks', icon: <User size={20} /> },
    { name: 'Completed Tasks', path: '/tasks-completed', icon: <CheckCircle size={20} /> },
    { name: 'Pending Tasks', path: '/tasks-pending', icon: <Clock size={20} /> },
    { name: 'In Progress Tasks', path: '/tasks-progress', icon: <AlertCircle size={20} /> },
    { name: 'Analytics', path: '/analytics', icon: <BarChart3 size={20} /> },
    { name: 'Calendar', path: '/calendar', icon: <CalendarDays size={20} /> },
    { name: 'Kanban Board', path: '/tasks', icon: <Layout size={20} /> },
    { name: 'Team Management', path: '/team', icon: <Users size={20} /> },
    { name: 'Notifications', path: '/notifications', icon: <Bell size={20} /> },
    { name: 'Reports', path: '/reports', icon: <FileText size={20} /> },
    { name: 'Profile', path: '/profile', icon: <User size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  if (user?.role === 'Admin') {
    navItems.splice(navItems.length - 2, 0, { name: 'Admin Panel', path: '/admin', icon: <Shield size={20} /> });
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#fcfcfc] dark:bg-[#0a0a0a] border-r border-gray-200 dark:border-gray-800 flex flex-col z-40">
      <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
        <div className="w-6 h-6 bg-black dark:bg-white text-white dark:text-black rounded-md flex items-center justify-center mr-3 text-xs font-black">O</div>
        <h1 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">O2H Tasks</h1>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-[2px] scrollbar-hide">
        <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 ml-3">Menu</div>
        
        {navItems.map((item) => (
          <NavLink 
            key={item.name} 
            to={item.path}
            className={({ isActive }) => 
              `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive 
                  ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white font-semibold' 
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
              }`
            }
          >
            <span className="mr-3 opacity-70">{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-1">
        <button onClick={() => setDarkMode(!darkMode)} className="flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors">
          <span className="mr-3 opacity-70">{darkMode ? <Sun size={18} /> : <Moon size={18} />}</span>
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
        
        <button onClick={logout} className="flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
          <span className="mr-3 opacity-70"><LogOut size={18} /></span>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
