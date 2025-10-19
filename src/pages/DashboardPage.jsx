import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertCircle, Clock, CheckCircle, XCircle, 
  TrendingUp, Calendar, Filter, AlertTriangle,
  BarChart3, PieChart, Activity
} from 'lucide-react';
import { PieChart as RechartsPC, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import useProjectStore from '../store/projectStore';
import useAuthStore from '../store/authStore';
import FilterBar from '../components/FilterBar';

const DashboardPage = () => {
  const { tasks, milestones, getProjectHealth, getFilteredTasks, filters } = useProjectStore();
  const { user, userRole } = useAuthStore();
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [projectHealth, setProjectHealth] = useState(null);

  useEffect(() => {
    // Initialize with sample data if empty
    if (tasks.length === 0) {
      initializeSampleData();
    }
    
    setFilteredTasks(getFilteredTasks());
    setProjectHealth(getProjectHealth());
  }, [filters, tasks]);

  const initializeSampleData = () => {
    const sampleTasks = [
      { id: '1', title: 'Foundation Work', status: 'work_done', assignedTo: 'BuildCo Inc', dueDate: '2024-01-15', priority: 'high' },
      { id: '2', title: 'Structural Framing', status: 'accepted', assignedTo: 'StructurePro', dueDate: '2024-01-20', priority: 'high' },
      { id: '3', title: 'Electrical Wiring', status: 'inspection_requested', assignedTo: 'ElectroCorp', dueDate: '2024-01-25', priority: 'medium' },
      { id: '4', title: 'Plumbing Installation', status: 'assigned', assignedTo: 'PlumbMaster', dueDate: '2024-01-30', priority: 'medium' },
      { id: '5', title: 'HVAC System', status: 'rework_required', assignedTo: 'AirFlow Inc', dueDate: '2024-02-05', priority: 'low', isDelayed: true },
      { id: '6', title: 'Interior Finishing', status: 'approved', assignedTo: 'FinishPro', dueDate: '2024-02-10', priority: 'low' },
    ];

    const sampleMilestones = [
      { id: '1', title: 'Phase 1 Completion', dueDate: '2024-01-31', status: 'upcoming' },
      { id: '2', title: 'Site Handover', dueDate: '2024-02-28', status: 'upcoming' },
      { id: '3', title: 'Final Inspection', dueDate: '2024-03-15', status: 'upcoming' },
    ];

    // Add sample data to store
    const projectStore = useProjectStore.getState();
    sampleTasks.forEach(task => projectStore.addTask(task));
    sampleMilestones.forEach(milestone => projectStore.addMilestone(milestone));
  };

  // Task Status Configuration
  const taskStatuses = {
    assigned: { label: 'Assigned', color: 'bg-gray-500', icon: Clock },
    accepted: { label: 'In Progress', color: 'bg-blue-500', icon: Activity },
    work_done: { label: 'Work Done', color: 'bg-purple-500', icon: CheckCircle },
    inspection_requested: { label: 'Inspection Requested', color: 'bg-yellow-500', icon: AlertCircle },
    rework_required: { label: 'Rework Required', color: 'bg-red-500', icon: XCircle },
    approved: { label: 'Approved', color: 'bg-green-500', icon: CheckCircle }
  };

  // Get tasks by status
  const getTasksByStatus = () => {
    const statusCount = {};
    Object.keys(taskStatuses).forEach(status => {
      statusCount[status] = filteredTasks.filter(task => task.status === status).length;
    });
    return statusCount;
  };

  const statusCount = getTasksByStatus();

  // Prepare data for charts
  const pieChartData = [
    { name: 'On-Time', value: projectHealth?.onTimePercentage || 0, color: '#10b981' },
    { name: 'Delayed', value: projectHealth?.delayedPercentage || 0, color: '#ef4444' }
  ];

  const barChartData = [
    { name: 'Pass', value: projectHealth?.inspectionPassRate || 0 },
    { name: 'Fail', value: 100 - (projectHealth?.inspectionPassRate || 0) }
  ];

  // Get critical tasks (inspection requested or delayed)
  const criticalTasks = filteredTasks.filter(task => 
    task.status === 'inspection_requested' || 
    task.status === 'rework_required' || 
    task.isDelayed
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Filter Bar */}
      <FilterBar />

      <div className="section-padding py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Project Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back, {user?.name}. Here's your project overview.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Widget 1: Project Task Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 card"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Project Task Overview</h2>
              <span className="text-sm text-gray-500">
                {filteredTasks.length} total tasks
              </span>
            </div>

            {/* Critical Tasks Alert */}
            {criticalTasks.length > 0 && (
              <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <span className="font-semibold text-yellow-800 dark:text-yellow-300">
                    {criticalTasks.length} Tasks Require Attention
                  </span>
                </div>
                <div className="space-y-2">
                  {criticalTasks.slice(0, 3).map(task => (
                    <div key={task.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700 dark:text-gray-300">{task.title}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        taskStatuses[task.status].color
                      } text-white`}>
                        {taskStatuses[task.status].label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Task Status Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Object.entries(taskStatuses).map(([status, config]) => {
                const Icon = config.icon;
                return (
                  <div
                    key={status}
                    className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`p-2 rounded ${config.color} bg-opacity-20`}>
                        <Icon className={`w-4 h-4 ${config.color.replace('bg-', 'text-')}`} />
                      </div>
                      <span className="text-2xl font-bold">{statusCount[status]}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {config.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Widget 2: Upcoming Milestones */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Upcoming Milestones</h2>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              {milestones.slice(0, 5).map((milestone, index) => (
                <div 
                  key={milestone.id}
                  className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0"
                >
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    index === 0 ? 'bg-red-500' : 'bg-gray-400'
                  }`} />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{milestone.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(milestone.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              
              {milestones.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No upcoming milestones
                </p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Widget 3: Overall Project Health */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card mt-6"
        >
          <h2 className="text-xl font-semibold mb-6">Overall Project Health</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Completion Percentage */}
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center w-32 h-32 mx-auto">
                <svg className="transform -rotate-90 w-32 h-32">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-gray-200 dark:text-gray-700"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - (projectHealth?.completionPercentage || 0) / 100)}`}
                    className="text-primary-600 transition-all duration-500"
                  />
                </svg>
                <span className="absolute text-2xl font-bold">
                  {Math.round(projectHealth?.completionPercentage || 0)}%
                </span>
              </div>
              <p className="mt-4 font-medium">Overall Completion</p>
            </div>

            {/* On-Time vs Delayed */}
            <div>
              <p className="font-medium mb-4 text-center">On-Time vs Delayed</p>
              <ResponsiveContainer width="100%" height={150}>
                <RechartsPC>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${Math.round(value)}%`} />
                </RechartsPC>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded" />
                  <span className="text-xs">On-Time</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded" />
                  <span className="text-xs">Delayed</span>
                </div>
              </div>
            </div>

            {/* Inspection Pass vs Fail */}
            <div>
              <p className="font-medium mb-4 text-center">Inspection Rate</p>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${Math.round(value)}%`} />
                  <Bar dataKey="value" fill="#a855f7" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;