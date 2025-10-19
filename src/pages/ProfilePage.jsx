import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Mail, Building, Shield, HardHat, 
  Save, Bell, Lock, Eye, EyeOff, CheckCircle 
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import { toast } from '../components/Toaster';

const ProfilePage = () => {
  const { user, userRole, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    company: user?.company || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = useState({
    taskAssigned: true,
    statusChanged: true,
    inspectionRequested: true,
    dailyDigest: false,
    weeklyReport: true
  });

  const handleSaveProfile = () => {
    // Validate passwords if changing
    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
      if (formData.newPassword.length < 6) {
        toast.error('Password must be at least 6 characters');
        return;
      }
    }

    // Update user data
    updateUser({
      name: formData.name,
      email: formData.email,
      company: formData.company
    });

    // Clear password fields
    setFormData({
      ...formData,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });

    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  const handleNotificationChange = (key) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key]
    });
    toast.success('Notification preferences updated');
  };

  const getRoleIcon = () => {
    return userRole === 'client' ? Shield : HardHat;
  };

  const getRoleBadgeColor = () => {
    return userRole === 'client' 
      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
      : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400';
  };

  const RoleIcon = getRoleIcon();

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
          <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account settings and preferences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <div className="card text-center">
              <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-primary-600">
                  {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              </div>
              
              <h2 className="text-xl font-semibold mb-2">{user?.name}</h2>
              
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor()} mb-4`}>
                <RoleIcon className="w-4 h-4" />
                {userRole === 'client' ? 'Client' : 'Subcontractor'}
              </span>
              
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Building className="w-4 h-4" />
                  <span>{user?.company}</span>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Account Verified</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Profile Edit Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Personal Information */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="w-5 h-5 text-primary-600" />
                  Personal Information
                </h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                  >
                    Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveProfile}
                      className="flex items-center gap-1 px-3 py-1 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          ...formData,
                          name: user?.name || '',
                          email: user?.email || '',
                          company: user?.company || ''
                        });
                      }}
                      className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!isEditing}
                    className="input-field disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:cursor-not-allowed"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing}
                    className="input-field disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:cursor-not-allowed"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    disabled={!isEditing}
                    className="input-field disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Change Password */}
            {isEditing && (
              <div className="card">
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-6">
                  <Lock className="w-5 h-5 text-primary-600" />
                  Change Password
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Current Password</label>
                    <input
                      type="password"
                      value={formData.currentPassword}
                      onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                      className="input-field"
                      placeholder="Enter current password"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">New Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.newPassword}
                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                        className="input-field pr-10"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="input-field"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Notification Preferences */}
            <div className="card">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-6">
                <Bell className="w-5 h-5 text-primary-600" />
                Notification Preferences
              </h3>
              
              <div className="space-y-4">
                {Object.entries({
                  taskAssigned: 'Email me when a task is assigned to me',
                  statusChanged: 'Email me when task status changes',
                  inspectionRequested: 'Email me when inspection is requested',
                  dailyDigest: 'Send daily project digest',
                  weeklyReport: 'Send weekly performance report'
                }).map(([key, label]) => (
                  <label key={key} className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm">{label}</span>
                    <button
                      type="button"
                      onClick={() => handleNotificationChange(key)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notifications[key] ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notifications[key] ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </label>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;