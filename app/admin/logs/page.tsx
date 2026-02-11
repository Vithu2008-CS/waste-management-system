'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Search, FileText, Clock, User } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminLogs() {
  const router = useRouter()
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

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

    fetchLogs(token)
  }, [router])

  const fetchLogs = async (token: string) => {
    try {
      const response = await fetch('/api/admin/logs', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setLogs(data.logs)
      } else {
        toast.error('Failed to fetch logs')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (log.details && log.details.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (log.userRole && log.userRole.toLowerCase().includes(searchTerm.toLowerCase()))
  )

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
          <h1 className="text-2xl font-bold text-white">System Logs</h1>
        </div>

        {/* Search */}
        <div className="glass-dark rounded-xl p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search logs by action, details, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Logs List */}
        <div className="space-y-4">
          {filteredLogs.map((log) => (
            <div key={log.id} className="glass-dark rounded-xl p-4 hover:bg-white/5 transition-colors">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-1 bg-white/10 rounded text-xs font-mono text-purple-300">
                      {log.action}
                    </span>
                    <span className="flex items-center gap-1 text-gray-400 text-xs">
                      <Clock className="w-3 h-3" />
                      {new Date(log.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm">{log.details || 'No details'}</p>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  {log.userRole && (
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {log.userRole}
                    </span>
                  )}
                  {log.ipAddress && (
                    <span className="font-mono text-xs bg-black/20 px-2 py-1 rounded">
                      {log.ipAddress}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {filteredLogs.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              No logs found
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
