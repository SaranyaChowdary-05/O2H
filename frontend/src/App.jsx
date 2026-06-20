import React, { useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Page Imports
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/Profile';
import Kanban from './pages/Kanban';
import TasksTable from './pages/TasksTable';
import Analytics from './pages/Analytics';
import TeamManagement from './pages/TeamManagement';
import NotificationsCenter from './pages/NotificationsCenter';
import CalendarPage from './pages/CalendarPage';
import AdminPanel from './pages/AdminPanel';
import Reports from './pages/Reports';
import SettingsPage from './pages/SettingsPage';
import CreateTaskPage from './pages/CreateTaskPage';
import Placeholder from './pages/Placeholder';

// Component Imports
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { AuthContext } from './context/AuthContext';
import api from './services/api';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.4
};

function Login() {
  const { login, user } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (user) return <Navigate to="/dashboard" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      alert(err.response?.data?.message || "Login failed.");
    }
  };

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="max-w-md mx-auto glass p-8 rounded-2xl mt-12 shadow-2xl border-t-4 border-primary">
      <h2 className="text-3xl font-black mb-2 text-center text-primary tracking-tight">Welcome Back</h2>
      <p className="text-gray-500 text-center mb-8">Sign in to continue to your dashboard.</p>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="name@company.com" required className="w-full p-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all shadow-inner" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required className="w-full p-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all shadow-inner" />
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="w-full bg-gradient-to-r from-primary to-blue-500 text-white p-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/30 mt-6">
          Sign In
        </motion.button>
      </form>
      <p className="text-center text-sm text-gray-600 mt-6">Don't have an account? <Link to="/register" className="text-primary font-bold hover:underline">Register here</Link></p>
    </motion.div>
  );
}

function Register() {
  const { login, user } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (user) return <Navigate to="/dashboard" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { name, email, password });
      await login(email, password);
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="max-w-md mx-auto p-8 border border-gray-200 dark:border-gray-800 rounded-2xl mt-24 bg-white dark:bg-[#0a0a0a]">
      <div className="w-10 h-10 bg-black dark:bg-white text-white dark:text-black rounded-lg flex items-center justify-center text-xl font-black mb-6">O</div>
      <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white tracking-tight">Create Account</h2>
      <p className="text-gray-500 text-sm mb-8">Join us and start managing your tasks efficiently.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-400 mb-1">Full Name</label>
          <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="John Doe" required className="w-full p-2.5 bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:border-black dark:focus:border-white transition-colors text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-400 mb-1">Email Address</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="name@company.com" required className="w-full p-2.5 bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:border-black dark:focus:border-white transition-colors text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-400 mb-1">Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Min 6 characters" required minLength={6} className="w-full p-2.5 bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:border-black dark:focus:border-white transition-colors text-sm" />
        </div>
        <button type="submit" className="w-full bg-black dark:bg-white text-white dark:text-black p-2.5 rounded-lg font-semibold text-sm transition-colors hover:bg-gray-800 dark:hover:bg-gray-200 mt-6">
          Register Now
        </button>
      </form>
      <p className="text-center text-sm text-gray-500 mt-6">Already have an account? <Link to="/login" className="text-black dark:text-white font-semibold hover:underline">Sign in</Link></p>
    </motion.div>
  );
}

const AnimatedRoutes = ({ darkMode, setDarkMode }) => {
  const location = useLocation();
  const { user } = useContext(AuthContext);
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          user ? <Navigate to="/dashboard" /> : (
            <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="p-12 text-center max-w-4xl mx-auto mt-24">
              <div className="w-20 h-20 bg-gradient-to-tr from-primary to-secondary text-white rounded-2xl flex items-center justify-center text-4xl font-black mx-auto mb-10 shadow-xl shadow-primary/30">O</div>
              <h2 className="text-6xl font-black mb-6 text-gray-900 dark:text-white tracking-tighter leading-tight">Flow through your work.</h2>
              <p className="text-xl text-gray-500 mb-12 leading-relaxed font-medium max-w-2xl mx-auto">A vibrant, dynamic workspace designed to help teams collaborate beautifully without constraints.</p>
              <div className="flex justify-center space-x-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/login" className="bg-gradient-to-r from-primary to-blue-500 text-white px-8 py-4 rounded-xl text-sm font-bold shadow-xl shadow-primary/30 block transition-all">Login</Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/register" className="bg-white dark:bg-gray-800 text-primary border border-gray-200 dark:border-gray-700 px-8 py-4 rounded-xl text-sm font-bold shadow-xl block transition-all hover:border-primary">Get Started Free</Link>
                </motion.div>
              </div>
            </motion.div>
          )
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Core Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="/tasks" element={user ? <Kanban /> : <Navigate to="/login" />} />
        <Route path="/add-task" element={user ? <CreateTaskPage /> : <Navigate to="/login" />} />
        
        {/* New 16-Item Sidebar Routes */}
        <Route path="/tasks-table" element={user ? <TasksTable defaultStatusFilter="All" /> : <Navigate to="/login" />} />
        <Route path="/my-tasks" element={user ? <TasksTable defaultStatusFilter="All" /> : <Navigate to="/login" />} />
        <Route path="/tasks-completed" element={user ? <TasksTable defaultStatusFilter="Completed" /> : <Navigate to="/login" />} />
        <Route path="/tasks-pending" element={user ? <TasksTable defaultStatusFilter="Pending" /> : <Navigate to="/login" />} />
        <Route path="/tasks-progress" element={user ? <TasksTable defaultStatusFilter="In Progress" /> : <Navigate to="/login" />} />
        
        <Route path="/analytics" element={user ? <Analytics /> : <Navigate to="/login" />} />
        <Route path="/calendar" element={user ? <CalendarPage /> : <Navigate to="/login" />} />
        <Route path="/team" element={user ? <TeamManagement /> : <Navigate to="/login" />} />
        <Route path="/notifications" element={user ? <NotificationsCenter /> : <Navigate to="/login" />} />
        
        {/* Remaining routes for final phase */}
        <Route path="/reports" element={user ? <Reports /> : <Navigate to="/login" />} />
        <Route path="/settings" element={user ? <SettingsPage darkMode={darkMode} setDarkMode={setDarkMode} /> : <Navigate to="/login" />} />
        <Route path="/admin" element={user?.role === 'Admin' ? <AdminPanel /> : <Navigate to="/dashboard" />} />
        
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} />} />
      </Routes>
    </AnimatePresence>
  );
};

const Layout = ({ children, darkMode, setDarkMode }) => {
  const { user } = useContext(AuthContext);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-[#0a0f1c] text-white' : 'bg-bg-light text-gray-900'}`}>
      <div className={`transition-all duration-300 min-h-screen flex flex-col pt-6`}>
        {user ? (
          <div className="px-4 lg:px-8 mb-6">
            <Header darkMode={darkMode} setDarkMode={setDarkMode} />
          </div>
        ) : (
          <nav className="p-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm sticky top-0 z-50 mx-4 lg:mx-8 rounded-2xl mt-4">
            <div className="container mx-auto flex justify-between items-center">
              <h1 className="text-2xl font-bold flex items-center text-gray-800 dark:text-white">
                <div className="w-8 h-8 bg-gradient-to-tr from-primary to-secondary text-white rounded-lg flex items-center justify-center mr-3 text-lg font-black shadow-md shadow-primary/20">O</div>
                O2H Tasks
              </h1>
              <div className="space-x-4 font-semibold text-sm">
                <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">Home</Link>
                <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">Login</Link>
                <Link to="/register" className="bg-primary text-white px-5 py-2.5 rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-primary/30">Sign Up</Link>
              </div>
            </div>
          </nav>
        )}
        <main className="px-4 lg:px-8 max-w-7xl mx-auto w-full flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  const { loading } = useContext(AuthContext);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  if (loading) return <div className="flex h-screen items-center justify-center"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <Router>
      <Layout darkMode={darkMode} setDarkMode={setDarkMode}>
        <AnimatedRoutes darkMode={darkMode} setDarkMode={setDarkMode} />
      </Layout>
    </Router>
  );
}

export default App;
