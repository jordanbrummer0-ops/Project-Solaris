import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Zap, Shield, Globe, Code2, Users, 
  TrendingUp, Sparkles, Rocket, CheckCircle 
} from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Built with Vite for blazing fast development and optimized production builds.',
    },
    {
      icon: Shield,
      title: 'Type Safe',
      description: 'TypeScript support out of the box for better developer experience.',
    },
    {
      icon: Globe,
      title: 'Global Ready',
      description: 'Internationalization and localization support for worldwide deployment.',
    },
    {
      icon: Code2,
      title: 'Modern Stack',
      description: 'Latest React 18 features with hooks, concurrent rendering, and more.',
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Built for teams with consistent coding standards and best practices.',
    },
    {
      icon: TrendingUp,
      title: 'Scalable',
      description: 'Architecture designed to grow with your application needs.',
    },
  ];

  const techStack = [
    'React 18', 'Vite', 'TailwindCSS', 'React Router', 
    'Framer Motion', 'Zustand', 'React Hook Form', 'Recharts'
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="section-padding py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-primary-600" />
                <span className="text-sm font-medium text-primary-700 dark:text-primary-400">
                  Welcome to the future of web development
                </span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold mb-6">
                Build Amazing Apps with{' '}
                <span className="gradient-text">AI Scale Pro</span>
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                A modern React application template powered by cutting-edge technologies. 
                Start building scalable, performant, and beautiful applications today.
              </p>
              
              <div className="flex gap-4 justify-center">
                <Link to="/dashboard" className="btn-primary inline-flex items-center gap-2">
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/about" className="btn-secondary">
                  Learn More
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-300 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-300 rounded-full filter blur-3xl opacity-20 animate-pulse animation-delay-400"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="section-padding">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Why Choose <span className="gradient-text">AI Scale Pro</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Everything you need to build modern web applications
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                      <Icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="section-padding">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Powered By Modern Technologies</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Built with the best tools in the ecosystem
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4">
            {techStack.map((tech, index) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="px-6 py-3 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700"
              >
                <span className="font-medium text-gray-800 dark:text-gray-200">{tech}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-accent-500">
        <div className="section-padding text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Rocket className="w-16 h-16 text-white mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of developers building amazing applications with our modern React template.
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200 shadow-xl"
            >
              Start Building Today
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;