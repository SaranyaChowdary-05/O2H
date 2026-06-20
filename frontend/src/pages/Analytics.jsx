import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Analytics = () => {
  const productivityData = [
    { name: 'Mon', tasks: 4 }, { name: 'Tue', tasks: 7 }, { name: 'Wed', tasks: 5 },
    { name: 'Thu', tasks: 8 }, { name: 'Fri', tasks: 6 }, { name: 'Sat', tasks: 2 }, { name: 'Sun', tasks: 1 }
  ];

  const pieData = [
    { name: 'Completed', value: 45 }, { name: 'In Progress', value: 30 }, { name: 'Pending', value: 25 }
  ];
  const COLORS = ['#22C55E', '#2563EB', '#F59E0B'];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white tracking-tight">Advanced Analytics</h2>
        <p className="text-gray-500 mt-1">Visualize your team's productivity and task distribution.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">Weekly Productivity</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productivityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="tasks" fill="#2563EB" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">Task Distribution</h3>
          <div className="h-80 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value" stroke="none">
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Analytics;
