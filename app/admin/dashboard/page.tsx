'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Shield, LogOut, Users, Trash2, Truck, Building, BarChart3, Activity } from 'lucide-react'
import toast from 'react-hot-toast'

interface Stats {
  totalComplaints: number
  pendingComplaints: number
  completedComplaints: number
  activeDrivers: number
  totalStudents: number
  totalDrivers: number
  totalDustbins: number
  totalFaculties: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      router.push('/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== 'ADMIN') {
      router.push('/login')
      return
    }

    setUser(parsedUser)
    fetchStats(token)
  }, [router])

  const fetchStats = async (token: string) => {
    try {
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      } else {
        toast.error('Failed to fetch statistics')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
    toast.success('Logged out successfully')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-sm text-gray-400">Welcome, {user?.name}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 glass-dark rounded-lg hover:bg-white/10 transition-colors text-white"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-dark rounded-2xl p-6 card-hover"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <Activity className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Total Complaints</h3>
            <p className="text-3xl font-bold text-white">{stats?.totalComplaints || 0}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-dark rounded-2xl p-6 card-hover"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Pending</h3>
            <p className="text-3xl font-bold text-white">{stats?.pendingComplaints || 0}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-dark rounded-2xl p-6 card-hover"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                <Truck className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Active Drivers</h3>
            <p className="text-3xl font-bold text-white">{stats?.activeDrivers || 0}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-dark rounded-2xl p-6 card-hover"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Total Students</h3>
            <p className="text-3xl font-bold text-white">{stats?.totalStudents || 0}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-dark rounded-2xl p-6 card-hover"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center">
                <Truck className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Total Drivers</h3>
            <p className="text-3xl font-bold text-white">{stats?.totalDrivers || 0}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-dark rounded-2xl p-6 card-hover"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Dustbins</h3>
            <p className="text-3xl font-bold text-white">{stats?.totalDustbins || 0}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-dark rounded-2xl p-6 card-hover"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Faculties</h3>
            <p className="text-3xl font-bold text-white">{stats?.totalFaculties || 0}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="glass-dark rounded-2xl p-6 card-hover"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Completed</h3>
            <p className="text-3xl font-bold text-white">{stats?.completedComplaints || 0}</p>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="glass-dark rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/admin/complaints')}
              className="p-4 glass rounded-xl hover:bg-white/10 transition-all text-left card-hover"
            >
              <BarChart3 className="w-8 h-8 text-green-400 mb-3" />
              <h3 className="text-white font-semibold mb-1">View Complaints</h3>
              <p className="text-gray-400 text-sm">Manage all complaints</p>
            </button>

            <button
              onClick={() => router.push('/admin/drivers')}
              className="p-4 glass rounded-xl hover:bg-white/10 transition-all text-left card-hover"
            >
              <Truck className="w-8 h-8 text-blue-400 mb-3" />
              <h3 className="text-white font-semibold mb-1">Manage Drivers</h3>
              <p className="text-gray-400 text-sm">Add, edit, or remove drivers</p>
            </button>

            <button
              onClick={() => router.push('/admin/dustbins')}
              className="p-4 glass rounded-xl hover:bg-white/10 transition-all text-left card-hover"
            >
              <Trash2 className="w-8 h-8 text-red-400 mb-3" />
              <h3 className="text-white font-semibold mb-1">Manage Dustbins</h3>
              <p className="text-gray-400 text-sm">Configure dustbin locations</p>
            </button>

            <button
              onClick={() => router.push('/admin/students')}
              className="p-4 glass rounded-xl hover:bg-white/10 transition-all text-left card-hover"
            >
              <Users className="w-8 h-8 text-purple-400 mb-3" />
              <h3 className="text-white font-semibold mb-1">Manage Students</h3>
              <p className="text-gray-400 text-sm">View student details</p>
            </button>

            <button
              onClick={() => router.push('/admin/logs')}
              className="p-4 glass rounded-xl hover:bg-white/10 transition-all text-left card-hover"
            >
              <Activity className="w-8 h-8 text-orange-400 mb-3" />
              <h3 className="text-white font-semibold mb-1">System Logs</h3>
              <p className="text-gray-400 text-sm">View activity logs</p>
            </button>

            <button
              onClick={() => router.push('/admin/settings')}
              className="p-4 glass rounded-xl hover:bg-white/10 transition-all text-left card-hover"
            >
              <Shield className="w-8 h-8 text-teal-400 mb-3" />
              <h3 className="text-white font-semibold mb-1">Settings</h3>
              <p className="text-gray-400 text-sm">Configure system settings</p>
            </button>
          </div>
        </div>

        {/* System Info */}
        <div className="glass-dark rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">System Information</h2>
          <div className="space-y-3 text-gray-300">
            <div className="flex justify-between py-2 border-b border-white/10">
              <span>System Version</span>
              <span className="text-white font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/10">
              <span>Database</span>
              <span className="text-white font-medium">SQLite</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/10">
              <span>Framework</span>
              <span className="text-white font-medium">Next.js 14</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Status</span>
              <span className="text-green-400 font-medium flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Operational
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
