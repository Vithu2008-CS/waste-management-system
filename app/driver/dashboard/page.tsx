'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Truck, LogOut, MapPin, Clock, CheckCircle, AlertCircle, Navigation, Power } from 'lucide-react'
import toast from 'react-hot-toast'

interface Complaint {
  id: string
  status: string
  description: string
  reportedAt: string
  assignedAt: string | null
  dustbin: {
    code: string
    location: string
    latitude: number
    longitude: number
    faculty: {
      name: string
    }
  }
  student: {
    user: {
      name: string
      phone: string
    }
  }
}

export default function DriverDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [driver, setDriver] = useState<any>(null)
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      router.push('/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== 'DRIVER') {
      router.push('/login')
      return
    }

    setUser(parsedUser)
    setDriver(parsedUser.driver)
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

  const toggleDriverStatus = async () => {
    setUpdatingStatus(true)
    try {
      const token = localStorage.getItem('token')
      const newStatus = driver.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'

      const response = await fetch('/api/driver/status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        const data = await response.json()
        setDriver(data.driver)
        
        // Update localStorage
        const userData = JSON.parse(localStorage.getItem('user') || '{}')
        userData.driver = data.driver
        localStorage.setItem('user', JSON.stringify(userData))
        
        toast.success(`Status updated to ${newStatus}`)
      } else {
        toast.error('Failed to update status')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setUpdatingStatus(false)
    }
  }

  const updateComplaintStatus = async (complaintId: string, status: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/complaints/${complaintId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        toast.success('Status updated successfully')
        fetchComplaints(token!)
      } else {
        toast.error('Failed to update status')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  const openInMaps = (lat: number, lng: number, location: string) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
    window.open(url, '_blank')
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
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Driver Dashboard</h1>
                <p className="text-sm text-gray-400">Welcome, {user?.name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Status Toggle */}
              <button
                onClick={toggleDriverStatus}
                disabled={updatingStatus}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  driver?.status === 'ACTIVE'
                    ? 'bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30'
                    : 'bg-gray-500/20 text-gray-300 border border-gray-500/30 hover:bg-gray-500/30'
                }`}
              >
                <Power className="w-4 h-4" />
                <span>{driver?.status === 'ACTIVE' ? 'Active' : 'Inactive'}</span>
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 glass-dark rounded-lg hover:bg-white/10 transition-colors text-white"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
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
              <h3 className="text-gray-400 text-sm">Assigned Tasks</h3>
              <Truck className="w-5 h-5 text-gray-400" />
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
              {complaints.filter(c => c.status === 'ASSIGNED').length}
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
              {complaints.filter(c => c.status === 'IN_PROGRESS').length}
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

        {/* Tasks List */}
        <div className="glass-dark rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6">My Tasks</h2>

          {complaints.length === 0 ? (
            <div className="text-center py-12">
              <Truck className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No tasks assigned yet</p>
              <p className="text-gray-500 text-sm mt-2">
                {driver?.status === 'ACTIVE' 
                  ? 'Waiting for new complaints...'
                  : 'Set your status to Active to receive tasks'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {complaints.map((complaint, index) => (
                <motion.div
                  key={complaint.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass rounded-xl p-5"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">{complaint.dustbin.code}</h3>
                      <div className="space-y-2 text-sm text-gray-300">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          {complaint.dustbin.location}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          Reported: {new Date(complaint.reportedAt).toLocaleString()}
                        </div>
                      </div>
                      {complaint.description && (
                        <p className="text-gray-400 text-sm mt-2">{complaint.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => openInMaps(complaint.dustbin.latitude, complaint.dustbin.longitude, complaint.dustbin.location)}
                      className="flex-1 px-4 py-2 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-all flex items-center justify-center space-x-2"
                    >
                      <Navigation className="w-4 h-4" />
                      <span>Navigate</span>
                    </button>

                    {complaint.status === 'ASSIGNED' && (
                      <button
                        onClick={() => updateComplaintStatus(complaint.id, 'IN_PROGRESS')}
                        className="flex-1 px-4 py-2 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-lg hover:bg-purple-500/30 transition-all"
                      >
                        Start Collection
                      </button>
                    )}

                    {complaint.status === 'IN_PROGRESS' && (
                      <button
                        onClick={() => updateComplaintStatus(complaint.id, 'COMPLETED')}
                        className="flex-1 px-4 py-2 bg-green-500/20 text-green-300 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-all flex items-center justify-center space-x-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Mark Complete</span>
                      </button>
                    )}
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
