import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, FileSpreadsheet, FilePieChart } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const Reports = () => {
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      return res.data.data;
    } catch (err) {
      toast.error('Failed to fetch data for report');
      return null;
    }
  };

  const handleExport = async (type) => {
    setLoading(true);
    toast.loading(`Generating ${type} report...`, { id: 'export' });
    
    const tasks = await fetchTasks();
    if (!tasks) {
      setLoading(false);
      toast.dismiss('export');
      return;
    }

    try {
      if (type === 'JSON') {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks, null, 2));
        triggerDownload(dataStr, "tasks_report.json");
      } 
      else if (type === 'CSV') {
        const headers = ["ID,Title,Status,Priority,Category,Due Date"];
        const rows = tasks.map(t => `${t._id},"${t.title.replace(/"/g, '""')}",${t.status},${t.priority},${t.category},${t.dueDate || 'N/A'}`);
        const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
        triggerDownload(encodeURI(csvContent), "tasks_report.csv");
      }
      else if (type === 'PDF') {
        // Fallback PDF generation using native print dialog
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
          <html>
            <head>
              <title>Executive Report</title>
              <style>
                body { font-family: sans-serif; padding: 40px; color: #111; }
                h1 { color: #111; border-bottom: 2px solid #eee; padding-bottom: 10px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                th { background-color: #f9fafb; }
              </style>
            </head>
            <body>
              <h1>Task Execution Report</h1>
              <p>Generated on: ${new Date().toLocaleString()}</p>
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Category</th>
                  </tr>
                </thead>
                <tbody>
                  ${tasks.map(t => `
                    <tr>
                      <td>${t.title}</td>
                      <td>${t.status}</td>
                      <td>${t.priority}</td>
                      <td>${t.category}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              <script>
                window.onload = () => { window.print(); }
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }

      toast.success(`${type} report ready!`, { id: 'export' });
    } catch (err) {
      toast.error(`Error generating ${type}`, { id: 'export' });
    } finally {
      setLoading(false);
    }
  };

  const triggerDownload = (dataURI, filename) => {
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataURI);
    downloadAnchorNode.setAttribute("download", filename);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex justify-between items-center bg-white dark:bg-[#0a0a0a] p-8 rounded-2xl border border-gray-200 dark:border-gray-800">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Automated Reports</h2>
          <p className="text-gray-500 mt-1">Generate and export professional analytics data for your organization.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#0a0a0a] p-8 rounded-2xl border border-gray-200 dark:border-gray-800 text-center group">
          <div className="w-16 h-16 bg-gray-50 dark:bg-[#111] text-gray-900 dark:text-white rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FileText size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">PDF Executive Report</h3>
          <p className="text-sm text-gray-500 mb-6">A formatted visual summary of overall team productivity.</p>
          <button disabled={loading} onClick={() => handleExport('PDF')} className="w-full bg-black dark:bg-white text-white dark:text-black font-bold py-3 rounded-xl transition-colors flex justify-center items-center hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50">
            <Download size={18} className="mr-2" /> Export PDF
          </button>
        </div>

        <div className="bg-white dark:bg-[#0a0a0a] p-8 rounded-2xl border border-gray-200 dark:border-gray-800 text-center group">
          <div className="w-16 h-16 bg-gray-50 dark:bg-[#111] text-gray-900 dark:text-white rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FileSpreadsheet size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">CSV Task Data</h3>
          <p className="text-sm text-gray-500 mb-6">Raw spreadsheet data for all tasks, categories, and timelines.</p>
          <button disabled={loading} onClick={() => handleExport('CSV')} className="w-full bg-black dark:bg-white text-white dark:text-black font-bold py-3 rounded-xl transition-colors flex justify-center items-center hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50">
            <Download size={18} className="mr-2" /> Export CSV
          </button>
        </div>

        <div className="bg-white dark:bg-[#0a0a0a] p-8 rounded-2xl border border-gray-200 dark:border-gray-800 text-center group">
          <div className="w-16 h-16 bg-gray-50 dark:bg-[#111] text-gray-900 dark:text-white rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FilePieChart size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Analytics Summary</h3>
          <p className="text-sm text-gray-500 mb-6">Chart data export for presentation and meeting integrations.</p>
          <button disabled={loading} onClick={() => handleExport('JSON')} className="w-full bg-black dark:bg-white text-white dark:text-black font-bold py-3 rounded-xl transition-colors flex justify-center items-center hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50">
            <Download size={18} className="mr-2" /> Export JSON
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Reports;
