'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Search, AlertCircle, CheckCircle, Trash2, Edit } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminComplaints() {
  const router = useRouter()
  const [complaints, setComplaints] = useState<any[]>([])
  const [drivers, setDrivers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const [searchTerm, setSearchTerm] = useState('')
  const [editingComplaint, setEditingComplaint] = useState<any>(null)
  const [showEditModal, setShowEditModal] = useState(false)

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

    fetchComplaints(token)
    fetchDrivers(token)
  }, [router])

  const fetchComplaints = async (token: string) => {
    try {
      const response = await fetch('/api/admin/complaints', {
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

  const fetchDrivers = async (token: string) => {
    try {
      const response = await fetch('/api/admin/drivers', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setDrivers(data.drivers)
      }
    } catch (error) {
      console.error('Failed to fetch drivers')
    }
  }

  const handleEdit = (complaint: any) => {
    setEditingComplaint({
      id: complaint.id,
      status: complaint.status,
      driverId: complaint.driverId || ''
    })
    setShowEditModal(true)
  }

  const handleUpdate = async () => {
    const token = localStorage.getItem('token')
    if (!token || !editingComplaint) return

    try {
      const response = await fetch(`/api/admin/complaints/${editingComplaint.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: editingComplaint.status,
          driverId: editingComplaint.driverId || null
        }),
      })

      if (response.ok) {
        toast.success('Complaint updated successfully')
        setShowEditModal(false)
        fetchComplaints(token)
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to update complaint')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this complaint?')) return

    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const response = await fetch(`/api/admin/complaints/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        toast.success('Complaint deleted successfully')
        fetchComplaints(token)
      } else {
        toast.error('Failed to delete complaint')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  const filteredComplaints = complaints.filter(complaint => {
    const matchesFilter = filter === 'ALL' || complaint.status === filter
    const matchesSearch = 
      complaint.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.dustbin.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.student.user.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'text-yellow-400 bg-yellow-400/10'
      case 'ASSIGNED': return 'text-blue-400 bg-blue-400/10'
      case 'IN_PROGRESS': return 'text-purple-400 bg-purple-400/10'
      case 'COMPLETED': return 'text-green-400 bg-green-400/10'
      case 'CANCELLED': return 'text-red-400 bg-red-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
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
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center mb-8">
          <button 
            onClick={() => router.back()}
            className="mr-4 p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-2xl font-bold text-white">Manage Complaints</h1>
        </div>

        {/* Filters */}
        <div className="glass-dark rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search complaints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {['ALL', 'PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  filter === status 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Complaints List */}
        <div className="space-y-4">
          {filteredComplaints.map((complaint) => (
            <div key={complaint.id} className="glass-dark rounded-xl p-6 card-hover">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                      {complaint.status.replace('_', ' ')}
                    </span>
                    <span className="text-gray-400 text-sm">
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-1">
                    {complaint.dustbin.location} ({complaint.dustbin.code})
                  </h3>
                  <p className="text-gray-300 mb-3">{complaint.description || 'No description provided'}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      Reported by: {complaint.student.user.name}
                    </span>
                    {complaint.driver && (
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Driver: {complaint.driver.user.name}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(complaint)}
                    className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={() => handleDelete(complaint.id)}
                    className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredComplaints.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              No complaints found matching your criteria
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingComplaint && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">Edit Complaint</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Status</label>
                <select
                  value={editingComplaint.status}
                  onChange={(e) => setEditingComplaint({...editingComplaint, status: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="ASSIGNED">ASSIGNED</option>
                  <option value="IN_PROGRESS">IN PROGRESS</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Assign Driver</label>
                <select
                  value={editingComplaint.driverId}
                  onChange={(e) => setEditingComplaint({...editingComplaint, driverId: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="">No Driver</option>
                  {drivers.map((driver) => (
                    <option key={driver.id} value={driver.id}>
                      {driver.user.name} - {driver.vehicleNumber}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
