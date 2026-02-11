'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Trash2, Plus, LogOut, MapPin, Clock, CheckCircle, AlertCircle, User } from 'lucide-react'
import toast from 'react-hot-toast'

interface Complaint {
  id: string
  status: string
  description: string
  reportedAt: string
  assignedAt: string | null
  completedAt: string | null
  dustbin: {
    code: string
    location: string
    faculty: {
      name: string
    }
  }
  driver: {
    user: {
      name: string
      phone: string
    }
  } | null
}

export default function StudentDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewComplaint, setShowNewComplaint] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      router.push('/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== 'STUDENT') {
      router.push('/login')
      return
    }

    setUser(parsedUser)
    fetchComplaints(token)
  }, [router])

  const fetchComplaints = async (token: string) => {
    try {
      const response = await fetch('/api/complaints', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setComplaints(data.complaints)
      } else {
        toast.error('Failed to fetch complaints')
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      case 'ASSIGNED':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      case 'IN_PROGRESS':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30'
      case 'COMPLETED':
        return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'CANCELLED':
        return 'bg-red-500/20 text-red-300 border-red-500/30'
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-4 h-4" />
      case 'ASSIGNED':
      case 'IN_PROGRESS':
        return <AlertCircle className="w-4 h-4" />
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
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
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Student Dashboard</h1>
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
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-dark rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm">Total Complaints</h3>
              <Trash2 className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-3xl font-bold text-white">{complaints.length}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-dark rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm">Pending</h3>
              <Clock className="w-5 h-5 text-yellow-400" />
            </div>
            <p className="text-3xl font-bold text-white">
              {complaints.filter(c => c.status === 'PENDING').length}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-dark rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm">In Progress</h3>
              <AlertCircle className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-white">
              {complaints.filter(c => c.status === 'ASSIGNED' || c.status === 'IN_PROGRESS').length}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-dark rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm">Completed</h3>
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-3xl font-bold text-white">
              {complaints.filter(c => c.status === 'COMPLETED').length}
            </p>
          </motion.div>
        </div>

        {/* New Complaint Button */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/student/new-complaint')}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Report New Complaint</span>
          </button>
        </div>

        {/* Complaints List */}
        <div className="glass-dark rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6">My Complaints</h2>

          {complaints.length === 0 ? (
            <div className="text-center py-12">
              <Trash2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No complaints yet</p>
              <p className="text-gray-500 text-sm mt-2">Report a full dustbin to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {complaints.map((complaint, index) => (
                <motion.div
                  key={complaint.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass rounded-xl p-5 card-hover"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{complaint.dustbin.code}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getStatusColor(complaint.status)}`}>
                          {getStatusIcon(complaint.status)}
                          <span>{complaint.status.replace('_', ' ')}</span>
                        </span>
                      </div>
                      <div className="flex items-center text-gray-400 text-sm space-x-4">
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {complaint.dustbin.location}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {new Date(complaint.reportedAt).toLocaleDateString()}
                        </span>
                      </div>
                      {complaint.description && (
                        <p className="text-gray-300 text-sm mt-2">{complaint.description}</p>
                      )}
                      {complaint.driver && (
                        <div className="mt-3 flex items-center text-sm text-gray-300">
                          <User className="w-4 h-4 mr-2" />
                          <span>Assigned to: {complaint.driver.user.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
