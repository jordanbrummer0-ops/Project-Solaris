import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, Edit, UserX, Mail, Building, Shield, HardHat, Search } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { toast } from '../components/Toaster';

const TeamPage = () => {
  const { userRole } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    // Initialize with sample team data
    setUsers([
      { id: '1', name: 'John Client', company: 'Client Corp', role: 'client', email: 'john@clientcorp.com' },
      { id: '2', name: 'Jane Subcontractor', company: 'BuildCo Inc', role: 'subcontractor', email: 'jane@buildco.com' },
      { id: '3', name: 'Mike Johnson', company: 'StructurePro', role: 'subcontractor', email: 'mike@structurepro.com' },
      { id: '4', name: 'Sarah Williams', company: 'ElectroCorp', role: 'subcontractor', email: 'sarah@electrocorp.com' },
      { id: '5', name: 'Tom Brown', company: 'PlumbMaster', role: 'subcontractor', email: 'tom@plumbmaster.com' },
      { id: '6', name: 'Emily Davis', company: 'Client Corp', role: 'client', email: 'emily@clientcorp.com' },
      { id: '7', name: 'Chris Wilson', company: 'AirFlow Inc', role: 'subcontractor', email: 'chris@airflow.com' },
      { id: '8', name: 'Lisa Anderson', company: 'FinishPro', role: 'subcontractor', email: 'lisa@finishpro.com' },
    ]);
  }, []);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = (userData) => {
    const newUser = {
      ...userData,
      id: Date.now().toString()
    };
    setUsers([...users, newUser]);
    setIsAddModalOpen(false);
    toast.success('User added successfully');
  };

  const handleEditUser = (userId, userData) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, ...userData } : user
    ));
    setEditingUser(null);
    toast.success('User updated successfully');
  };

  const handleDeactivateUser = (userId) => {
    if (window.confirm('Are you sure you want to deactivate this user?')) {
      setUsers(users.filter(user => user.id !== userId));
      toast.success('User deactivated successfully');
    }
  };

  const getRoleIcon = (role) => {
    return role === 'client' ? Shield : HardHat;
  };

  const getRoleBadgeColor = (role) => {
    return role === 'client' 
      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
      : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400';
  };

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
          <h1 className="text-3xl font-bold mb-2">Team Management</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage project participants and their roles
          </p>
        </motion.div>

        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, company, or email..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Add User Button - Only visible to clients */}
            {userRole === 'client' && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="btn-primary flex items-center gap-2"
              >
                <UserPlus className="w-5 h-5" />
                Add User
              </button>
            )}
          </div>
        </div>

        {/* User List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-4 px-6 font-semibold text-sm">Name</th>
                  <th className="text-left py-4 px-6 font-semibold text-sm">Company</th>
                  <th className="text-left py-4 px-6 font-semibold text-sm">Role</th>
                  <th className="text-left py-4 px-6 font-semibold text-sm">Email</th>
                  {userRole === 'client' && (
                    <th className="text-center py-4 px-6 font-semibold text-sm">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const RoleIcon = getRoleIcon(user.role);
                  return (
                    <tr
                      key={user.id}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-primary-600">
                              {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </span>
                          </div>
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Building className="w-4 h-4" />
                          {user.company}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                          <RoleIcon className="w-3 h-3" />
                          {user.role === 'client' ? 'Client' : 'Subcontractor'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Mail className="w-4 h-4" />
                          <a href={`mailto:${user.email}`} className="hover:text-primary-600 dark:hover:text-primary-400">
                            {user.email}
                          </a>
                        </div>
                      </td>
                      {userRole === 'client' && (
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setEditingUser(user)}
                              className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                              title="Edit User"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeactivateUser(user.id)}
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              title="Deactivate User"
                            >
                              <UserX className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
                
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={userRole === 'client' ? 5 : 4} className="text-center py-12 text-gray-500 dark:text-gray-400">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* User Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{users.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
              </div>
              <Users className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{users.filter(u => u.role === 'client').length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Clients</p>
              </div>
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{users.filter(u => u.role === 'subcontractor').length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Subcontractors</p>
              </div>
              <HardHat className="w-8 h-8 text-orange-400" />
            </div>
          </div>
        </div>

        {/* Add/Edit User Modal */}
        {(isAddModalOpen || editingUser) && userRole === 'client' && (
          <UserFormModal
            user={editingUser}
            onSave={editingUser ? (data) => handleEditUser(editingUser.id, data) : handleAddUser}
            onClose={() => {
              setIsAddModalOpen(false);
              setEditingUser(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

// User Form Modal Component
const UserFormModal = ({ user, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    company: user?.company || '',
    role: user?.role || 'subcontractor'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full"
      >
        <h2 className="text-xl font-bold mb-4">
          {user ? 'Edit User' : 'Add New User'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input-field"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Company</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="input-field"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="input-field"
              required
            >
              <option value="subcontractor">Subcontractor</option>
              <option value="client">Client</option>
            </select>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button type="submit" className="btn-primary flex-1">
              {user ? 'Update' : 'Add'} User
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default TeamPage;