import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, HardHat, LogIn, Eye, EyeOff } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { toast } from '../components/Toaster';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  // Demo credentials
  const demoAccounts = {
    client: { email: 'client@example.com', password: 'client123' },
    subcontractor: { email: 'subcontractor@example.com', password: 'sub123' }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Demo login logic
    let userData = null;
    
    if (email === demoAccounts.client.email && password === demoAccounts.client.password) {
      userData = {
        id: '1',
        name: 'John Client',
        email: email,
        role: 'client',
        company: 'Client Corp'
      };
    } else if (email === demoAccounts.subcontractor.email && password === demoAccounts.subcontractor.password) {
      userData = {
        id: '2',
        name: 'Jane Subcontractor',
        email: email,
        role: 'subcontractor',
        company: 'BuildCo Inc'
      };
    }

    if (userData) {
      login(userData);
      toast.success(`Welcome back, ${userData.name}!`);
      navigate('/dashboard');
    } else {
      toast.error('Invalid credentials. Please try again.');
    }
    
    setIsLoading(false);
  };

  const handleDemoLogin = (role) => {
    setEmail(demoAccounts[role].email);
    setPassword(demoAccounts[role].password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4">
              <Shield className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Project Management</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Integrated Quality & Task Management System
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-10"
                  placeholder="Enter your password"
                  required
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Demo Account Buttons */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
              Try with demo accounts:
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleDemoLogin('client')}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                <Shield className="w-4 h-4" />
                Client
              </button>
              <button
                onClick={() => handleDemoLogin('subcontractor')}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
              >
                <HardHat className="w-4 h-4" />
                Subcontractor
              </button>
            </div>
            
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-xs">
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                <strong>Client:</strong> client@example.com / client123
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <strong>Subcontractor:</strong> subcontractor@example.com / sub123
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;