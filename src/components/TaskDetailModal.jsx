import React, { useState } from 'react';
import { X, MessageSquare, FileText, Activity, Send, Upload, Clock, CheckCircle, AlertTriangle, Calendar, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../store/authStore';
import useProjectStore from '../store/projectStore';
import { toast } from './Toaster';

const TaskDetailModal = ({ task, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('comments');
  const [comment, setComment] = useState('');
  const [delayReason, setDelayReason] = useState('');
  const { user, userRole, canInteractWithTask, hasPermission } = useAuthStore();
  const { updateTask, addComment, addDocument, moveTask } = useProjectStore();

  if (!isOpen) return null;

  const isAssignedToUser = canInteractWithTask(task);

  const tabs = [
    { id: 'comments', label: 'Comments', icon: MessageSquare },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'activity', label: 'Activity Log', icon: Activity },
  ];

  const handleAddComment = () => {
    if (!comment.trim()) return;
    
    addComment(task.id, {
      userId: user.id,
      userName: user.name,
      content: comment,
    });
    
    setComment('');
    toast.success('Comment added');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    addDocument(task.id, {
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedBy: user.name,
    });
    
    toast.success('Document uploaded');
  };

  const handleWorkDone = () => {
    moveTask(task.id, 'work_done', user.id, user.name);
    toast.success('Task marked as work done');
    onClose();
  };

  const handleRequestInspection = () => {
    moveTask(task.id, 'inspection_requested', user.id, user.name);
    toast.success('Inspection requested');
    onClose();
  };

  const handleApproveInspection = () => {
    moveTask(task.id, 'approved', user.id, user.name);
    toast.success('Task approved');
    onClose();
  };

  const handleRejectInspection = () => {
    moveTask(task.id, 'rework_required', user.id, user.name);
    toast.warning('Task sent for rework');
    onClose();
  };

  const handleNoteDelay = () => {
    if (!delayReason.trim()) {
      toast.error('Please provide a reason for the delay');
      return;
    }
    
    updateTask(task.id, {
      isDelayed: true,
      delayReason: delayReason,
      delayNotedBy: user.name,
      delayNotedAt: new Date().toISOString(),
    });
    
    setDelayReason('');
    toast.success('Delay noted');
  };

  const renderActionButtons = () => {
    const buttons = [];

    if (userRole === 'client') {
      buttons.push(
        <button key="assign" className="btn-secondary flex items-center gap-2">
          <User className="w-4 h-4" />
          Assign Task
        </button>,
        <button key="due-date" className="btn-secondary flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Change Due Date
        </button>
      );

      if (task.status === 'inspection_requested') {
        buttons.push(
          <button
            key="approve"
            onClick={handleApproveInspection}
            className="btn-primary flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Approve Inspection
          </button>,
          <button
            key="reject"
            onClick={handleRejectInspection}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Reject (Rework)
          </button>
        );
      }
    }

    if (userRole === 'subcontractor' && isAssignedToUser) {
      if (task.status === 'accepted') {
        buttons.push(
          <button
            key="work-done"
            onClick={handleWorkDone}
            className="btn-primary flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Mark as Work Done
          </button>
        );
      }

      if (task.status === 'work_done') {
        buttons.push(
          <button
            key="request-inspection"
            onClick={handleRequestInspection}
            className="btn-primary flex items-center gap-2"
          >
            <Activity className="w-4 h-4" />
            Request Inspection
          </button>
        );
      }

      if (task.status === 'accepted' || task.status === 'work_done') {
        buttons.push(
          <div key="delay" className="flex gap-2 flex-1">
            <input
              type="text"
              value={delayReason}
              onChange={(e) => setDelayReason(e.target.value)}
              placeholder="Reason for delay..."
              className="input-field flex-1"
            />
            <button
              onClick={handleNoteDelay}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              Note Delay
            </button>
          </div>
        );
      }
    }

    return buttons;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{task.title}</h2>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {task.assignedTo || 'Unassigned'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                      </span>
                      {task.isDelayed && (
                        <span className="flex items-center gap-1 text-red-600">
                          <AlertTriangle className="w-4 h-4" />
                          Delayed
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Description */}
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                  {task.description || 'No description available'}
                </p>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <div className="flex">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                          flex items-center gap-2 px-6 py-3 font-medium transition-colors
                          ${activeTab === tab.id
                            ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                          }
                        `}
                      >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6 max-h-[400px] overflow-y-auto">
                {/* Comments Tab */}
                {activeTab === 'comments' && (
                  <div>
                    <div className="space-y-4 mb-4">
                      {task.comments?.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-primary-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{comment.userName}</span>
                              <span className="text-xs text-gray-500">
                                {new Date(comment.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                      
                      {!task.comments?.length && (
                        <p className="text-center text-gray-500 py-8">No comments yet</p>
                      )}
                    </div>

                    {/* Add Comment */}
                    <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <input
                        type="text"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="input-field flex-1"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                      />
                      <button
                        onClick={handleAddComment}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Documents Tab */}
                {activeTab === 'documents' && (
                  <div>
                    <div className="space-y-3 mb-4">
                      {task.documents?.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-gray-500" />
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <p className="text-xs text-gray-500">
                                Uploaded by {doc.uploadedBy} • {new Date(doc.uploadedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {!task.documents?.length && (
                        <p className="text-center text-gray-500 py-8">No documents uploaded</p>
                      )}
                    </div>

                    {/* Upload Document */}
                    <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                      <Upload className="w-5 h-5" />
                      <span>Upload Document</span>
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}

                {/* Activity Log Tab */}
                {activeTab === 'activity' && (
                  <div className="space-y-3">
                    {task.activityLog?.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-gray-400 rounded-full mt-2" />
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium">{activity.userName}</span>
                            {' '}{activity.action}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {!task.activityLog?.length && (
                      <p className="text-center text-gray-500 py-8">No activity recorded</p>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-wrap gap-3">
                  {renderActionButtons()}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TaskDetailModal;