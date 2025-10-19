import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, TrendingUp, Users, Award, 
  AlertTriangle, CheckCircle, XCircle, Clock 
} from 'lucide-react';
import { 
  BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import useProjectStore from '../store/projectStore';

const AnalyticsPage = () => {
  const { tasks, getSubcontractorPerformance } = useProjectStore();
  const [performance, setPerformance] = useState({});
  const [delayReasons, setDelayReasons] = useState([]);
  const [qualityHotspots, setQualityHotspots] = useState([]);

  useEffect(() => {
    // Calculate performance metrics
    const perfData = getSubcontractorPerformance();
    setPerformance(perfData);

    // Analyze delay reasons
    const delays = {};
    tasks.forEach(task => {
      if (task.isDelayed && task.delayReason) {
        delays[task.delayReason] = (delays[task.delayReason] || 0) + 1;
      }
    });
    
    const delayData = Object.entries(delays).map(([reason, count]) => ({
      name: reason,
      value: count,
      percentage: (count / tasks.filter(t => t.isDelayed).length) * 100
    }));
    setDelayReasons(delayData);

    // Identify quality hotspots
    const reworkBySubcontractor = {};
    tasks.forEach(task => {
      if (task.status === 'rework_required' && task.assignedTo) {
        reworkBySubcontractor[task.assignedTo] = (reworkBySubcontractor[task.assignedTo] || 0) + 1;
      }
    });
    
    const hotspotData = Object.entries(reworkBySubcontractor)
      .map(([name, count]) => ({ name, reworks: count }))
      .sort((a, b) => b.reworks - a.reworks)
      .slice(0, 5);
    setQualityHotspots(hotspotData);
  }, [tasks]);

  // Prepare data for subcontractor performance table
  const performanceTableData = Object.entries(performance).map(([name, data]) => ({
    name,
    totalTasks: data.totalTasks,
    completedOnTime: data.completedOnTime,
    delayed: data.delayed,
    onTimePercentage: data.totalTasks > 0 
      ? Math.round((data.completedOnTime / data.totalTasks) * 100) 
      : 0,
    passFailRatio: data.totalTasks > 0 
      ? Math.round(((data.inspectionPassed || 0) / Math.max(1, (data.inspectionPassed || 0) + (data.inspectionFailed || 0))) * 100)
      : 100
  }));

  // Colors for charts
  const pieColors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#a855f7', '#ec4899'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="section-padding py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Performance metrics and project insights
          </p>
        </motion.div>

        {/* Report 1: Subcontractor Performance Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="card mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 text-primary-600" />
              Subcontractor Performance
            </h2>
            <span className="text-sm text-gray-500">
              All data is transparent and non-anonymized
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-semibold text-sm">
                    Subcontractor Name
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-sm">
                    Total Assigned
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-sm">
                    Completed On-Time
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-sm">
                    Delayed
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-sm">
                    On-Time %
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-sm">
                    Pass/Fail Ratio %
                  </th>
                </tr>
              </thead>
              <tbody>
                {performanceTableData.map((row, index) => (
                  <tr
                    key={row.name}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                          <span className="text-xs font-semibold text-primary-600">
                            {row.name.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium">{row.name}</span>
                      </div>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className="font-semibold">{row.totalTasks}</span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        {row.completedOnTime}
                      </span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className="text-red-600 dark:text-red-400 font-medium">
                        {row.delayed}
                      </span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              row.onTimePercentage >= 80 ? 'bg-green-500' :
                              row.onTimePercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${row.onTimePercentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {row.onTimePercentage}%
                        </span>
                      </div>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className={`
                        px-2 py-1 rounded text-sm font-medium
                        ${row.passFailRatio >= 90 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          row.passFailRatio >= 70 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}
                      `}>
                        {row.passFailRatio}%
                      </span>
                    </td>
                  </tr>
                ))}
                
                {performanceTableData.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No performance data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Report 2: Project Delay Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="card"
          >
            <div className="flex items-center gap-2 mb-6">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <h2 className="text-xl font-semibold">Project Delay Analysis</h2>
            </div>

            {delayReasons.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={delayReasons}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name.substring(0, 15)}... (${Math.round(entry.percentage)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {delayReasons.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

                <div className="mt-4 space-y-2">
                  {delayReasons.slice(0, 3).map((reason, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded"
                          style={{ backgroundColor: pieColors[index % pieColors.length] }}
                        />
                        <span className="text-gray-600 dark:text-gray-400">
                          {reason.name}
                        </span>
                      </div>
                      <span className="font-medium">{reason.value} tasks</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No delays reported yet</p>
              </div>
            )}
          </motion.div>

          {/* Report 3: Quality Assurance Hotspots */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="card"
          >
            <div className="flex items-center gap-2 mb-6">
              <XCircle className="w-5 h-5 text-red-600" />
              <h2 className="text-xl font-semibold">Quality Assurance Hotspots</h2>
            </div>

            {qualityHotspots.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={qualityHotspots}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="reworks" fill="#ef4444" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>

                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <p className="text-sm text-red-800 dark:text-red-300">
                    <strong>Action Required:</strong> These subcontractors have the highest rework rates. 
                    Consider additional training or quality checks.
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50 text-green-500" />
                <p>No quality issues detected</p>
                <p className="text-sm mt-2">All work meeting quality standards</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-2xl font-bold">{tasks.length}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-2xl font-bold">
                {Math.round((tasks.filter(t => !t.isDelayed).length / Math.max(1, tasks.length)) * 100)}%
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">On-Time Rate</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Award className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-2xl font-bold">
                {Math.round((tasks.filter(t => t.status !== 'rework_required').length / Math.max(1, tasks.length)) * 100)}%
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Quality Pass Rate</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Users className="w-5 h-5 text-orange-600" />
              </div>
              <span className="text-2xl font-bold">{Object.keys(performance).length}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Active Subcontractors</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsPage;