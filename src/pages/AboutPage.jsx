import React from 'react';
import { motion } from 'framer-motion';
import { 
  Target, Lightbulb, Award, Users, 
  Star, Coffee, Code, Heart 
} from 'lucide-react';

const AboutPage = () => {
  const teamMembers = [
    {
      name: 'Alex Johnson',
      role: 'CEO & Founder',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      bio: 'Visionary leader with 10+ years in tech.',
    },
    {
      name: 'Sarah Chen',
      role: 'CTO',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      bio: 'Full-stack expert and architecture enthusiast.',
    },
    {
      name: 'Mike Rodriguez',
      role: 'Lead Designer',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
      bio: 'Creative mind behind our beautiful interfaces.',
    },
    {
      name: 'Emily Watson',
      role: 'Head of Product',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
      bio: 'Product strategist focused on user success.',
    },
  ];

  const values = [
    {
      icon: Target,
      title: 'Mission Driven',
      description: 'We are committed to building tools that empower developers to create amazing applications.',
    },
    {
      icon: Lightbulb,
      title: 'Innovation First',
      description: 'Constantly pushing boundaries and exploring new technologies to stay ahead.',
    },
    {
      icon: Users,
      title: 'Community Focused',
      description: 'Building a strong community of developers who support and learn from each other.',
    },
    {
      icon: Award,
      title: 'Quality Assured',
      description: 'Delivering high-quality code and maintaining best practices in everything we do.',
    },
  ];

  const stats = [
    { value: '50K+', label: 'Active Users' },
    { value: '1M+', label: 'Downloads' },
    { value: '99.9%', label: 'Uptime' },
    { value: '24/7', label: 'Support' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20">
        <div className="section-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl font-bold mb-6">
              About <span className="gradient-text">AI Scale Pro</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              We're on a mission to revolutionize web development with modern tools 
              and best practices, making it easier for developers to build amazing applications.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="section-padding">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="section-padding">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                      <Icon className="w-6 h-6 text-primary-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="section-padding">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              The talented people behind AI Scale Pro
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card text-center"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 bg-gray-100 dark:bg-gray-700"
                />
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-primary-600 dark:text-primary-400 mb-3">{member.role}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="section-padding">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Our Story</h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="prose prose-lg dark:prose-invert mx-auto text-gray-600 dark:text-gray-400"
            >
              <p className="mb-6">
                AI Scale Pro was born from a simple idea: make web development faster, 
                more efficient, and more enjoyable. As developers ourselves, we experienced 
                firsthand the challenges of setting up new projects with modern best practices.
              </p>
              <p className="mb-6">
                In 2024, we decided to create a solution that would save developers hours 
                of setup time and provide a solid foundation for building scalable applications. 
                What started as a small side project quickly grew into a comprehensive platform 
                used by thousands of developers worldwide.
              </p>
              <p>
                Today, AI Scale Pro continues to evolve with the latest technologies and 
                community feedback. We're committed to staying at the forefront of web 
                development innovation and helping developers build amazing things.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex justify-center items-center gap-4 mt-12 text-gray-600 dark:text-gray-400"
            >
              <Coffee className="w-5 h-5" />
              <span>Built with</span>
              <Heart className="w-5 h-5 text-red-500 fill-current" />
              <span>and lots of</span>
              <Code className="w-5 h-5" />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;