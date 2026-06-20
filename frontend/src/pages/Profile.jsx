import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Shield, Calendar } from 'lucide-react';

const Profile = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <h2 className="text-3xl font-bold mb-6">User Profile</h2>
      
      <div className="glass p-8 rounded-2xl flex flex-col md:flex-row gap-8 items-center md:items-start">
        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold text-5xl shadow-xl">
          {user.name?.charAt(0)}
        </div>
        
        <div className="flex-1 space-y-4 w-full">
          <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border">
            <User className="text-primary" />
            <div>
              <p className="text-sm text-gray-500 font-semibold">Full Name</p>
              <p className="text-lg font-bold">{user.name}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border">
            <Mail className="text-primary" />
            <div>
              <p className="text-sm text-gray-500 font-semibold">Email Address</p>
              <p className="text-lg font-bold">{user.email}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border">
            <Shield className="text-primary" />
            <div>
              <p className="text-sm text-gray-500 font-semibold">Role</p>
              <p className="text-lg font-bold">{user.role || 'User'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
