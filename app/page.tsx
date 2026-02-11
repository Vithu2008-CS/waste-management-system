'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Trash2, Users, Truck, MapPin, BarChart3, Shield, Zap, Globe } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Navigation */}
        <nav className="relative z-10 container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <Trash2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Eastern University</h1>
                <p className="text-sm text-gray-300">Waste Management System</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-4"
            >
              <Link 
                href="/login"
                className="px-6 py-2.5 text-white hover:text-green-300 transition-colors font-medium"
              >
                Login
              </Link>
              <Link 
                href="/register"
                className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
              >
                Get Started
              </Link>
            </motion.div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Smart Waste Collection
                <span className="block mt-2 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  Made Simple
                </span>
              </h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed"
            >
              Real-time waste management with intelligent route optimization,
              automated task allocation, and seamless communication.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white text-lg font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-2xl hover:shadow-green-500/50 transform hover:-translate-y-1"
              >
                Start Reporting
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-4 glass text-white text-lg font-semibold rounded-xl hover:bg-white/20 transition-all transform hover:-translate-y-1"
              >
                Sign In
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Powerful Features
          </h3>
          <p className="text-xl text-gray-300">
            Everything you need for efficient waste management
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-2xl p-6 card-hover"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">{feature.title}</h4>
              <p className="text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* User Roles Section */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Built for Everyone
          </h3>
          <p className="text-xl text-gray-300">
            Tailored experiences for students, drivers, and administrators
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {roles.map((role, index) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="glass-dark rounded-3xl p-8 card-hover"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                <role.icon className="w-9 h-9 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-white mb-3">{role.title}</h4>
              <p className="text-gray-300 mb-6">{role.description}</p>
              <ul className="space-y-3">
                {role.features.map((feature) => (
                  <li key={feature} className="flex items-start text-gray-300">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-dark rounded-3xl p-12 md:p-16 text-center"
        >
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Get Started?
          </h3>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join Eastern University's smart waste management system today and contribute to a cleaner campus.
          </p>
          <Link
            href="/register"
            className="inline-block px-10 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white text-lg font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-2xl hover:shadow-green-500/50 transform hover:-translate-y-1"
          >
            Create Account
          </Link>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 mt-20">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400">
              © 2025 Eastern University. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

const features = [
  {
    icon: MapPin,
    title: 'Real-time Tracking',
    description: 'Track driver locations and dustbin statuses in real-time with Google Maps integration.',
  },
  {
    icon: Zap,
    title: 'Smart Allocation',
    description: 'Intelligent task assignment to the nearest available driver for optimal efficiency.',
  },
  {
    icon: Shield,
    title: 'Secure Access',
    description: 'Role-based authentication ensuring secure access for students, drivers, and admins.',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Comprehensive logging and analytics for monitoring all system activities.',
  },
  {
    icon: Globe,
    title: 'Route Optimization',
    description: 'Automated route calculation using Google Maps for fastest collection times.',
  },
  {
    icon: Users,
    title: 'Multi-user Support',
    description: 'Seamless collaboration between students, drivers, and administrators.',
  },
  {
    icon: Truck,
    title: 'Driver Management',
    description: 'Easy status updates and task management for collection drivers.',
  },
  {
    icon: Trash2,
    title: 'Complaint System',
    description: 'Simple and intuitive complaint reporting for full dustbins.',
  },
]

const roles = [
  {
    icon: Users,
    title: 'Students',
    description: 'Report full dustbins and track complaint status',
    features: [
      'Quick complaint registration',
      'Real-time status updates',
      'View complaint history',
      'Location-based reporting',
    ],
  },
  {
    icon: Truck,
    title: 'Drivers',
    description: 'Manage collections and update task status',
    features: [
      'View assigned tasks',
      'Update availability status',
      'Navigate to dustbin locations',
      'Mark tasks as completed',
    ],
  },
  {
    icon: Shield,
    title: 'Administrators',
    description: 'Oversee operations and manage system data',
    features: [
      'Comprehensive dashboard',
      'Manage users and resources',
      'View collection logs',
      'System configuration',
    ],
  },
]
