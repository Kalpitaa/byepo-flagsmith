import { useState, useEffect, useCallback } from 'react'
import Navbar from '../Navbar'
import Toast from '../Toast'
import FlagModal from '../FlagModal'
import { flagsAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'

const DashboardPage = () => {
  const { user } = useAuth()
  const [flags, setFlags] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editFlag, setEditFlag] = useState(null)
  const [modalLoading, setModalLoading] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => setToast({ message, type })

  const fetchFlags = useCallback(async () => {
    try {
      const res = await flagsAPI.getFlags()
      setFlags(res.data.data.flags)
    } catch {
      showToast('Failed to load feature flags.', 'error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFlags()
  }, [fetchFlags])

  const handleCreate = async (form) => {
    setModalLoading(true)
    try {
      const res = await flagsAPI.createFlag(form)
      setFlags((prev) => [res.data.data.flag, ...prev])
      setModalOpen(false)
      showToast('Feature flag created successfully!')
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create flag.', 'error')
    } finally {
      setModalLoading(false)
    }
  }

  const handleUpdate = async (form) => {
    setModalLoading(true)
    try {
      const res = await flagsAPI.updateFlag(editFlag._id, {
        description: form.description,
        enabled: form.enabled,
      })
      setFlags((prev) =>
        prev.map((f) => (f._id === editFlag._id ? res.data.data.flag : f))
      )
      setModalOpen(false)
      setEditFlag(null)
      showToast('Feature flag updated successfully!')
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update flag.', 'error')
    } finally {
      setModalLoading(false)
    }
  }

  const handleToggle = async (flag) => {
    try {
      const res = await flagsAPI.updateFlag(flag._id, { enabled: !flag.enabled })
      setFlags((prev) =>
        prev.map((f) => (f._id === flag._id ? res.data.data.flag : f))
      )
      showToast(`Flag "${flag.feature_key}" ${!flag.enabled ? 'enabled' : 'disabled'}.`)
    } catch {
      showToast('Failed to toggle flag.', 'error')
    }
  }

  const handleDelete = async (id) => {
    setDeleteId(id)
    try {
      await flagsAPI.deleteFlag(id)
      setFlags((prev) => prev.filter((f) => f._id !== id))
      showToast('Feature flag deleted.')
    } catch {
      showToast('Failed to delete flag.', 'error')
    } finally {
      setDeleteId(null)
    }
  }

  const openEdit = (flag) => {
    setEditFlag(flag)
    setModalOpen(true)
  }

  const openCreate = () => {
    setEditFlag(null)
    setModalOpen(true)
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

      <FlagModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditFlag(null) }}
        onSubmit={editFlag ? handleUpdate : handleCreate}
        editFlag={editFlag}
        loading={modalLoading}
      />

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Feature Flags</h1>
            <p className="text-gray-400 mt-1 text-sm">
              Managing flags for{' '}
              <span className="text-violet-400 font-medium">
                {user?.organisation?.name}
              </span>
            </p>
          </div>
          <button
            onClick={openCreate}
            className="py-2.5 px-4 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-lg transition-colors text-sm"
          >
            + New Flag
          </button>
        </div>

        {/* Stats bar */}
        {!loading && flags.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="card py-4">
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Total Flags</p>
              <p className="text-2xl font-bold text-white">{flags.length}</p>
            </div>
            <div className="card py-4">
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Enabled</p>
              <p className="text-2xl font-bold text-green-400">
                {flags.filter((f) => f.enabled).length}
              </p>
            </div>
            <div className="card py-4">
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Disabled</p>
              <p className="text-2xl font-bold text-gray-400">
                {flags.filter((f) => !f.enabled).length}
              </p>
            </div>
          </div>
        )}

        {/* Flags list */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-4 bg-gray-800 rounded w-40 mb-2" />
                    <div className="h-3 bg-gray-800 rounded w-64" />
                  </div>
                  <div className="h-6 bg-gray-800 rounded w-12" />
                </div>
              </div>
            ))}
          </div>
        ) : flags.length === 0 ? (
          <div className="card text-center py-16">
            <div className="text-5xl mb-4">🚩</div>
            <h3 className="text-white font-semibold mb-2">No feature flags yet</h3>
            <p className="text-gray-500 text-sm mb-6">
              Create your first flag to start controlling features.
            </p>
            <button
              onClick={openCreate}
              className="py-2.5 px-6 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-lg transition-colors text-sm mx-auto"
            >
              Create your first flag
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {flags.map((flag) => (
              <div
                key={flag._id}
                className="card flex items-center justify-between gap-4 hover:border-gray-700 transition-colors"
              >
                {/* Left: flag info */}
                <div className="flex items-center gap-4 min-w-0">
                  {/* Toggle */}
                  <button
                    onClick={() => handleToggle(flag)}
                    role="switch"
                    aria-checked={flag.enabled}
                    className={`relative w-11 h-6 rounded-full transition-colors focus:outline-none flex-shrink-0 ${
                      flag.enabled ? 'bg-violet-600' : 'bg-gray-700'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        flag.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-semibold text-white text-sm">
                        {flag.feature_key}
                      </span>
                      <span
                        className={`badge ${
                          flag.enabled
                            ? 'bg-green-900 text-green-300'
                            : 'bg-gray-800 text-gray-400'
                        }`}
                      >
                        {flag.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    {flag.description && (
                      <p className="text-gray-500 text-xs mt-0.5 truncate">
                        {flag.description}
                      </p>
                    )}
                    <p className="text-gray-700 text-xs mt-0.5">
                      Created {formatDate(flag.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Right: actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => openEdit(flag)}
                    className="py-1.5 px-3 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium rounded-lg transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(flag._id)}
                    disabled={deleteId === flag._id}
                    className="btn-danger"
                  >
                    {deleteId === flag._id ? '…' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default DashboardPage;