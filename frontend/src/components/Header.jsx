import React, { useContext, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { Search, Bell, Sun, Moon, LogOut, LayoutDashboard, ListTodo, PlusSquare, User, CheckCircle, Clock, AlertCircle, BarChart3, CalendarDays, Layout, Users, FileText, Settings, Shield } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Header = ({ darkMode, setDarkMode }) => {
  const { user, logout } = useContext(AuthContext);
  const scrollContainerRef = useRef(null);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={16} /> },
    { name: 'All Tasks', path: '/tasks-table', icon: <ListTodo size={16} /> },
    { name: 'Create', path: '/add-task', icon: <PlusSquare size={16} /> },
    { name: 'My Tasks', path: '/my-tasks', icon: <User size={16} /> },
    { name: 'Completed', path: '/tasks-completed', icon: <CheckCircle size={16} /> },
    { name: 'Pending', path: '/tasks-pending', icon: <Clock size={16} /> },
    { name: 'In Progress', path: '/tasks-progress', icon: <AlertCircle size={16} /> },
    { name: 'Kanban', path: '/tasks', icon: <Layout size={16} /> },
    { name: 'Analytics', path: '/analytics', icon: <BarChart3 size={16} /> },
    { name: 'Calendar', path: '/calendar', icon: <CalendarDays size={16} /> },
    { name: 'Team', path: '/team', icon: <Users size={16} /> },
    { name: 'Reports', path: '/reports', icon: <FileText size={16} /> },
  ];

  if (user?.role === 'Admin') {
    navItems.push({ name: 'Admin', path: '/admin', icon: <Shield size={16} /> });
  }

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: direction * 200, behavior: 'smooth' });
    }
  };

  return (
    <header className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-3xl shadow-lg shadow-primary/5 sticky top-6 z-40 overflow-hidden flex flex-col transition-colors">
      
      {/* Top Row: Brand & Actions */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-tr from-primary to-secondary text-white rounded-xl flex items-center justify-center mr-3 text-lg font-black shadow-md shadow-primary/30">O</div>
          <h1 className="text-xl font-black text-gray-800 dark:text-white tracking-tight mr-8 hidden md:block">O2H Tasks</h1>
          
          <div className="hidden lg:flex items-center bg-gray-50 dark:bg-gray-800/50 px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-700/50 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all w-80">
            <Search size={18} className="text-gray-400 mr-2" />
            <input type="text" placeholder="Search across your workspace..." className="bg-transparent border-none outline-none w-full text-sm dark:text-white" />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button onClick={() => setDarkMode(!darkMode)} className="p-2.5 text-gray-500 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <NavLink to="/notifications" className={({isActive}) => `relative p-2.5 rounded-xl transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-500 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full"></span>
          </NavLink>

          <NavLink to="/settings" className={({isActive}) => `p-2.5 rounded-xl transition-colors hidden md:block ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-500 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
            <Settings size={20} />
          </NavLink>
          
          <div className="h-8 w-px bg-gray-200 dark:bg-gray-800 mx-2 hidden md:block"></div>
          
          <NavLink to="/profile" className="flex items-center pl-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent to-primary flex items-center justify-center text-white font-bold shadow-md">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="ml-3 hidden lg:block text-left">
              <p className="text-sm font-bold text-gray-800 dark:text-white leading-tight">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500 font-medium">{user?.role || 'Member'}</p>
            </div>
          </NavLink>

          <button onClick={logout} className="ml-2 p-2.5 text-danger bg-red-50 dark:bg-red-900/10 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors hidden md:block">
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Bottom Row: Navigation Pills */}
      <div className="px-2 py-2 relative flex items-center bg-gray-50/50 dark:bg-gray-900/30">
        <button onClick={() => scroll(-1)} className="absolute left-0 z-10 p-2 bg-gradient-to-r from-white dark:from-gray-900 via-white dark:via-gray-900 to-transparent text-gray-500 hidden md:block h-full px-4"><span className="opacity-0">L</span></button>
        
        <div ref={scrollContainerRef} className="flex overflow-x-auto space-x-1 scrollbar-hide px-4 md:px-8 snap-x">
          {navItems.map((item) => (
            <NavLink 
              key={item.name} 
              to={item.path}
              className={({ isActive }) => 
                `flex items-center px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all snap-start ${
                  isActive 
                    ? 'bg-primary text-white shadow-md shadow-primary/20' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`
              }
            >
              <span className={`mr-2 ${item.path === window.location.pathname ? 'opacity-100' : 'opacity-70'}`}>{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </div>
        
        <button onClick={() => scroll(1)} className="absolute right-0 z-10 p-2 bg-gradient-to-l from-white dark:from-gray-900 via-white dark:via-gray-900 to-transparent text-gray-500 hidden md:block h-full px-4"><span className="opacity-0">R</span></button>
      </div>
    </header>
  );
};

export default Header;
