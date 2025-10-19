import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { 
  User, Mail, Shield, Camera, Save, 
  Award, Calendar, Activity, Settings,
  Edit2, Check, X
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import { toast } from '../components/Toaster';

const ProfilePage = () => {
  const { user, updateProfile, isLoading } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: user?.name,
      email: user?.email,
      bio: user?.bio || '',
      location: user?.location || '',
      website: user?.website || '',
    }
  });

  const stats = [
    { label: 'Member Since', value: 'Jan 2024', icon: Calendar },
    { label: 'Projects', value: '12', icon: Activity },
    { label: 'Achievements', value: '8', icon: Award },
    { label: 'Team Members', value: '5', icon: User },
  ];

  const achievements = [
    { name: 'Early Adopter', description: 'Joined in the first month', icon: '🎯' },
    { name: 'Project Creator', description: 'Created 10+ projects', icon: '🚀' },
    { name: 'Team Player', description: 'Collaborated with 5+ people', icon: '🤝' },
    { name: 'Bug Hunter', description: 'Reported 3 bugs', icon: '🐛' },
  ];

  const onSubmit = async (data) => {
    const result = await updateProfile(data);
    if (result.success) {
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } else {
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    reset({
      name: user?.name,
      email: user?.email,
      bio: user?.bio || '',
      location: user?.location || '',
      website: user?.website || '',
    });
    setIsEditing(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="section-padding py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Profile</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account settings and preferences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <div className="card text-center">
              <div className="relative inline-block mb-4">
                <img
                  src={avatarPreview || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
                  alt={user?.name}
                  className="w-32 h-32 rounded-full mx-auto bg-gray-200 dark:bg-gray-700"
                />
                {isEditing && (
                  <label className="absolute bottom-0 right-0 p-2 bg-primary-600 text-white rounded-full cursor-pointer hover:bg-primary-700 transition-colors">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </label>
                )}
              </div>
              
              <h2 className="text-2xl font-bold mb-1">{user?.name}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-2">{user?.email}</p>
              
              {user?.role && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-sm font-medium mb-4">
                  <Shield className="w-4 h-4" />
                  {user.role}
                </span>
              )}
              
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              )}
            </div>

            {/* Stats */}
            <div className="card mt-6">
              <h3 className="font-semibold mb-4">Statistics</h3>
              <div className="space-y-3">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {stat.label}
                        </span>
                      </div>
                      <span className="font-semibold">{stat.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Profile Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Profile Information</h3>
                {isEditing && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancel}
                      className="p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleSubmit(onSubmit)}
                      disabled={isLoading}
                      className="p-2 bg-primary-600 text-white hover:bg-primary-700 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Check className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      className="input-field disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                      {...register('name', { required: 'Name is required' })}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      disabled={!isEditing}
                      className="input-field disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address',
                        },
                      })}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Bio
                  </label>
                  <textarea
                    rows={3}
                    disabled={!isEditing}
                    className="input-field disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed resize-none"
                    placeholder="Tell us about yourself..."
                    {...register('bio')}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      className="input-field disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                      placeholder="San Francisco, CA"
                      {...register('location')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      disabled={!isEditing}
                      className="input-field disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                      placeholder="https://example.com"
                      {...register('website')}
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Achievements */}
            <div className="card mt-6">
              <h3 className="text-lg font-semibold mb-6">Achievements</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <span className="text-2xl">{achievement.icon}</span>
                    <div>
                      <p className="font-medium">{achievement.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {achievement.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Danger Zone */}
            <div className="card mt-6 border-red-200 dark:border-red-800">
              <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">
                Danger Zone
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Delete Account
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;