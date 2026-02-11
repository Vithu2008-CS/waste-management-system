'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Settings, Save } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminSettings() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  
  // Mock settings state
  const [settings, setSettings] = useState({
    siteName: 'Waste Management System',
    maintenanceMode: false,
    emailNotifications: true,
    autoAssignDrivers: true
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

    setLoading(false)
  }, [router])

  const handleSave = () => {
    // In a real app, this would make an API call
    toast.success('Settings saved successfully')
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
          <h1 className="text-2xl font-bold text-white">System Settings</h1>
        </div>

        <div className="glass-dark rounded-xl p-8 max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8 pb-4 border-b border-white/10">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-700 rounded-xl flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">General Configuration</h2>
              <p className="text-gray-400 text-sm">Manage system-wide settings</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Application Name</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex items-center justify-between py-4 border-t border-white/10">
              <div>
                <h3 className="text-white font-medium">Maintenance Mode</h3>
                <p className="text-sm text-gray-400">Disable access for non-admin users</p>
              </div>
              <button
                onClick={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  settings.maintenanceMode ? 'bg-purple-600' : 'bg-white/10'
                }`}
              >
                <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  settings.maintenanceMode ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between py-4 border-t border-white/10">
              <div>
                <h3 className="text-white font-medium">Email Notifications</h3>
                <p className="text-sm text-gray-400">Send emails for important updates</p>
              </div>
              <button
                onClick={() => setSettings({...settings, emailNotifications: !settings.emailNotifications})}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  settings.emailNotifications ? 'bg-purple-600' : 'bg-white/10'
                }`}
              >
                <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  settings.emailNotifications ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between py-4 border-t border-white/10">
              <div>
                <h3 className="text-white font-medium">Auto-Assign Drivers</h3>
                <p className="text-sm text-gray-400">Automatically assign nearest driver to complaints</p>
              </div>
              <button
                onClick={() => setSettings({...settings, autoAssignDrivers: !settings.autoAssignDrivers})}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  settings.autoAssignDrivers ? 'bg-purple-600' : 'bg-white/10'
                }`}
              >
                <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  settings.autoAssignDrivers ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>

            <div className="pt-6 mt-6 border-t border-white/10">
              <button
                onClick={handleSave}
                className="w-full flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
              >
                <Save className="w-5 h-5" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
