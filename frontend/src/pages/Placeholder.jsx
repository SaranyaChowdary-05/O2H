import React from 'react';
import { motion } from 'framer-motion';
import { Construction } from 'lucide-react';

const Placeholder = ({ title }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      className="h-[70vh] flex flex-col items-center justify-center text-center animate-fade-in"
    >
      <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
        <Construction size={48} className="text-primary opacity-50" />
      </div>
      <h2 className="text-4xl font-black text-gray-800 dark:text-white tracking-tight mb-4">{title}</h2>
      <p className="text-gray-500 max-w-md text-lg">
        This premium feature is currently being built in the next deployment phase. Check back soon!
      </p>
    </motion.div>
  );
};

export default Placeholder;
