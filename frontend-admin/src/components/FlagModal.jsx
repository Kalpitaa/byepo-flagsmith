import { useState, useEffect } from 'react'

const FlagModal = ({ isOpen, onClose, onSubmit, editFlag, loading }) => {
  const [form, setForm] = useState({ feature_key: '', description: '', enabled: false })
  const [error, setError] = useState('')

  useEffect(() => {
    if (editFlag) {
      setForm({
        feature_key: editFlag.feature_key,
        description: editFlag.description || '',
        enabled: editFlag.enabled,
      })
    } else {
      setForm({ feature_key: '', description: '', enabled: false })
    }
    setError('')
  }, [editFlag, isOpen])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.feature_key.trim()) {
      setError('Feature key is required.')
      return
    }
    if (!/^[a-z0-9_]+$/.test(form.feature_key.trim())) {
      setError('Feature key can only contain lowercase letters, numbers, and underscores.')
      return
    }
    onSubmit(form)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-gray-900 border border-gray-700 rounded-xl shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="text-base font-semibold text-white">
            {editFlag ? 'Edit Feature Flag' : 'Create Feature Flag'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="px-3 py-2.5 bg-red-900 border border-red-700 text-red-200 text-sm rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Feature Key <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="feature_key"
              value={form.feature_key}
              onChange={handleChange}
              placeholder="e.g. dark_mode or new_checkout"
              className="input-field font-mono"
              disabled={!!editFlag}
            />
            <p className="text-gray-600 text-xs mt-1">
              Lowercase letters, numbers, and underscores only.
              {editFlag && ' Key cannot be changed after creation.'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Description <span className="text-gray-500">(optional)</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="What does this feature flag control?"
              rows={3}
              className="input-field resize-none"
            />
          </div>

          <div className="flex items-center gap-3 py-1">
            <button
              type="button"
              role="switch"
              aria-checked={form.enabled}
              onClick={() => setForm((prev) => ({ ...prev, enabled: !prev.enabled }))}
              className={`relative w-11 h-6 rounded-full transition-colors focus:outline-none ${
                form.enabled ? 'bg-violet-600' : 'bg-gray-700'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  form.enabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span className="text-sm text-gray-300">
              {form.enabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 px-4 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving…' : editFlag ? 'Save Changes' : 'Create Flag'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FlagModal;