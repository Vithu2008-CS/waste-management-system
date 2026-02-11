'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Search, Plus, Trash2, MapPin, Building, Edit } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminDustbins() {
  const router = useRouter()
  const [dustbins, setDustbins] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingDustbin, setEditingDustbin] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    code: '',
    location: '',
    latitude: '',
    longitude: '',
    capacity: '',
    facultyId: ''
  })

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

    fetchDustbins(token)
  }, [router])

  const fetchDustbins = async (token: string) => {
    try {
      const response = await fetch('/api/admin/dustbins', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setDustbins(data.dustbins)
      } else {
        toast.error('Failed to fetch dustbins')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleAddDustbin = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const response = await fetch('/api/admin/dustbins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Dustbin added successfully')
        setShowAddModal(false)
        setFormData({
          code: '',
          location: '',
          latitude: '',
          longitude: '',
          capacity: '',
          facultyId: ''
        })
        fetchDustbins(token)
      } else {
        toast.error(data.error || 'Failed to add dustbin')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  const handleEdit = (dustbin: any) => {
    setEditingDustbin({
      id: dustbin.id,
      code: dustbin.code,
      location: dustbin.location,
      latitude: dustbin.latitude.toString(),
      longitude: dustbin.longitude.toString(),
      capacity: dustbin.capacity.toString(),
      facultyId: dustbin.facultyId
    })
    setShowEditModal(true)
  }

  const handleUpdate = async () => {
    const token = localStorage.getItem('token')
    if (!token || !editingDustbin) return

    try {
      const response = await fetch(`/api/admin/dustbins/${editingDustbin.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editingDustbin),
      })

      if (response.ok) {
        toast.success('Dustbin updated successfully')
        setShowEditModal(false)
        fetchDustbins(token)
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to update dustbin')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this dustbin?')) return

    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const response = await fetch(`/api/admin/dustbins/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        toast.success('Dustbin deleted successfully')
        fetchDustbins(token)
      } else {
        toast.error('Failed to delete dustbin')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  const filteredDustbins = dustbins.filter(dustbin => 
    dustbin.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dustbin.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dustbin.faculty.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    )
  }

  // Get unique faculty IDs for the form
  const facultyOptions = [...new Map(dustbins.map(d => [d.faculty.id, d.faculty])).values()]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button 
              onClick={() => router.back()}
              className="mr-4 p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <h1 className="text-2xl font-bold text-white">Manage Dustbins</h1>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Dustbin</span>
          </button>
        </div>

        {/* Search */}
        <div className="glass-dark rounded-xl p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search dustbins by code, location, or faculty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Dustbins Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDustbins.map((dustbin) => (
            <div key={dustbin.id} className="glass-dark rounded-xl p-6 card-hover">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-white" />
                </div>
                <span className="text-gray-400 text-sm font-mono">
                  {dustbin.code}
                </span>
              </div>
              
              <h3 className="text-white font-semibold text-lg mb-1">{dustbin.location}</h3>
              <p className="text-red-400 text-sm mb-4">{dustbin.faculty.name}</p>
              
              <div className="space-y-2 text-sm text-gray-300 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  {dustbin.latitude.toFixed(4)}, {dustbin.longitude.toFixed(4)}
                </div>
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-gray-500" />
                  Capacity: {dustbin.capacity}L
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(dustbin)}
                  className="flex-1 flex items-center justify-center gap-2 p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4 text-white" />
                  <span className="text-white text-sm">Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(dustbin.id)}
                  className="flex-1 flex items-center justify-center gap-2 p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-white" />
                  <span className="text-white text-sm">Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Dustbin Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold text-white mb-4">Add New Dustbin</h2>
              <form onSubmit={handleAddDustbin} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Code</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={formData.latitude}
                      onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={formData.longitude}
                      onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Capacity (L)</label>
                  <input
                    type="number"
                    required
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Faculty</label>
                  <select
                    required
                    value={formData.facultyId}
                    onChange={(e) => setFormData({...formData, facultyId: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="">Select Faculty</option>
                    {facultyOptions.map((faculty) => (
                      <option key={faculty.id} value={faculty.id}>
                        {faculty.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  >
                    Add Dustbin
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Dustbin Modal */}
        {showEditModal && editingDustbin && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold text-white mb-4">Edit Dustbin</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Code</label>
                  <input
                    type="text"
                    value={editingDustbin.code}
                    onChange={(e) => setEditingDustbin({...editingDustbin, code: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Location</label>
                  <input
                    type="text"
                    value={editingDustbin.location}
                    onChange={(e) => setEditingDustbin({...editingDustbin, location: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      value={editingDustbin.latitude}
                      onChange={(e) => setEditingDustbin({...editingDustbin, latitude: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      value={editingDustbin.longitude}
                      onChange={(e) => setEditingDustbin({...editingDustbin, longitude: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Capacity (L)</label>
                  <input
                    type="number"
                    value={editingDustbin.capacity}
                    onChange={(e) => setEditingDustbin({...editingDustbin, capacity: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Faculty</label>
                  <select
                    value={editingDustbin.facultyId}
                    onChange={(e) => setEditingDustbin({...editingDustbin, facultyId: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                  >
                    {facultyOptions.map((faculty) => (
                      <option key={faculty.id} value={faculty.id}>
                        {faculty.name}
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
    </div>
  )
}
