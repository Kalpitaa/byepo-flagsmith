import { useState, useEffect, useCallback } from 'react'
import Navbar from '../Navbar.jsx'
import Toast from '../Toast.jsx'
import { superAdminAPI } from '../services/api'

const DashboardPage = () => {
  const [organisations, setOrganisations] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [orgName, setOrgName] = useState('')
  const [formError, setFormError] = useState('')
  const [toast, setToast] = useState(null)

  const fetchOrganisations = useCallback(async () => {
    try {
      const res = await superAdminAPI.getOrganisations()
      setOrganisations(res.data.data.organisations)
    } catch (err) {
      setToast({ message: 'Failed to load organisations.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrganisations()
  }, [fetchOrganisations])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!orgName.trim()) {
      setFormError('Organisation name is required.')
      return
    }
    setCreating(true)
    setFormError('')
    try {
      const res = await superAdminAPI.createOrganisation({ name: orgName.trim() })
      setOrganisations((prev) => [res.data.data.organisation, ...prev])
      setOrgName('')
      setToast({ message: 'Organisation created successfully!', type: 'success' })
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create organisation.')
    } finally {
      setCreating(false)
    }
  }

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    })

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1 text-sm">Manage organisations across the platform.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create form */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h2 className="text-base font-semibold text-white mb-1">Create Organisation</h2>
              <p className="text-gray-500 text-xs mb-5">
                New organisations can then onboard their own admins.
              </p>

              {formError && (
                <div className="mb-4 px-3 py-2.5 bg-red-900 border border-red-800 text-red-300 text-sm rounded-lg">
                  {formError}
                </div>
              )}

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Organisation name
                  </label>
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => { setOrgName(e.target.value); setFormError('') }}
                    placeholder="e.g. Acme Corp"
                    className="input-field"
                  />
                </div>
                <button type="submit" disabled={creating} className="btn-primary">
                  {creating ? 'Creating…' : 'Create Organisation'}
                </button>
              </form>
            </div>
          </div>

          {/* Organisations list */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-white">Organisations</h2>
              {!loading && (
                <span className="badge bg-gray-800 text-gray-400">{organisations.length} total</span>
              )}
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="card animate-pulse">
                    <div className="h-4 bg-gray-800 rounded w-1/3 mb-2" />
                    <div className="h-3 bg-gray-800 rounded w-1/4" />
                  </div>
                ))}
              </div>
            ) : organisations.length === 0 ? (
              <div className="card text-center py-12">
                <div className="text-4xl mb-3">🏢</div>
                <p className="text-gray-400 text-sm">No organisations yet.</p>
                <p className="text-gray-600 text-xs mt-1">Create your first organisation using the form.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {organisations.map((org) => (
                  <div key={org._id} className="card flex items-start justify-between hover:border-gray-700 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-900 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-indigo-300 font-semibold text-sm">
                          {org.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-sm">{org.name}</h3>
                        <p className="text-gray-500 text-xs font-mono">slug: {org.slug}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <p className="text-gray-500 text-xs">Created {formatDate(org.createdAt)}</p>
                      <p className="text-gray-600 text-xs font-mono mt-0.5">{org._id}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default DashboardPage;