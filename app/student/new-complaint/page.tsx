'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Trash2, MapPin, Send } from 'lucide-react'
import toast from 'react-hot-toast'

interface Dustbin {
  id: string
  code: string
  location: string
  faculty: {
    name: string
  }
}

export default function NewComplaintPage() {
  const router = useRouter()
  const [dustbins, setDustbins] = useState<Dustbin[]>([])
  const [formData, setFormData] = useState({
    dustbinId: '',
    description: '',
  })
  const [loading, setLoading] = useState(false)
  const [fetchingDustbins, setFetchingDustbins] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    fetchDustbins(token)
  }, [router])

  const fetchDustbins = async (token: string) => {
    try {
      const response = await fetch('/api/dustbins', {
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
      setFetchingDustbins(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.dustbinId) {
      toast.error('Please select a dustbin')
      return
    }

    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Complaint submitted successfully!')
        router.push('/student/dashboard')
      } else {
        toast.error(data.error || 'Failed to submit complaint')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (fetchingDustbins) {
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
          <button
            onClick={() => router.back()}
            className="flex items-center text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="glass-dark rounded-3xl p-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Trash2 className="w-9 h-9 text-white" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-white text-center mb-2">
              Report Full Dustbin
            </h1>
            <p className="text-gray-400 text-center mb-8">
              Select a dustbin location and provide details
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dustbin Selection */}
              <div>
                <label htmlFor="dustbin" className="block text-sm font-medium text-gray-300 mb-2">
                  Select Dustbin <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <select
                    id="dustbin"
                    required
                    value={formData.dustbinId}
                    onChange={(e) => setFormData({ ...formData, dustbinId: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all appearance-none"
                  >
                    <option value="" className="bg-slate-800">Choose a location...</option>
                    {dustbins.map((dustbin) => (
                      <option key={dustbin.id} value={dustbin.id} className="bg-slate-800">
                        {dustbin.code} - {dustbin.location} ({dustbin.faculty.name})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                  Additional Details (Optional)
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                  placeholder="Provide any additional information about the dustbin condition..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <div className="spinner border-white"></div>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Submit Complaint
                  </>
                )}
              </button>
            </form>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
              <p className="text-sm text-blue-300">
                <strong>Note:</strong> Once submitted, your complaint will be automatically assigned to the nearest available driver for collection.
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
