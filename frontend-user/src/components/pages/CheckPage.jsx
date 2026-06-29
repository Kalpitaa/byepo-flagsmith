import { useState, useEffect } from 'react'
import { checkFlag, getOrganisations } from '../services/api'

const STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  ENABLED: 'enabled',
  DISABLED: 'disabled',
  NOT_FOUND: 'not_found',
  ERROR: 'error',
}

const CheckPage = () => {
  const [featureKey, setFeatureKey] = useState('')
  const [organisationId, setOrganisationId] = useState('')
  const [organisations, setOrganisations] = useState([])
  const [orgsLoading, setOrgsLoading] = useState(true)
  const [status, setStatus] = useState(STATUS.IDLE)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [history, setHistory] = useState([])

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const res = await getOrganisations()
        setOrganisations(res.data.data.organisations)
      } catch {
        setError('Failed to load organisations. Is the backend running?')
      } finally {
        setOrgsLoading(false)
      }
    }
    fetchOrgs()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!featureKey.trim()) {
      setError('Feature key is required.')
      return
    }
    if (!organisationId) {
      setError('Please select an organisation.')
      return
    }

    setStatus(STATUS.LOADING)
    setResult(null)

    try {
      const res = await checkFlag(featureKey.trim().toLowerCase(), organisationId)
      const data = res.data.data
      setResult(data)

      const newStatus = !data.exists
        ? STATUS.NOT_FOUND
        : data.enabled
        ? STATUS.ENABLED
        : STATUS.DISABLED

      setStatus(newStatus)

      // Add to history
      const org = organisations.find((o) => o._id === organisationId)
      setHistory((prev) => [
        {
          id: Date.now(),
          feature_key: data.feature_key,
          organisation: org?.name || organisationId,
          enabled: data.enabled,
          exists: data.exists,
          checkedAt: new Date(),
        },
        ...prev.slice(0, 9), // keep last 10
      ])
    } catch {
      setStatus(STATUS.ERROR)
      setError('Failed to check flag. Please try again.')
    }
  }

  const handleReset = () => {
    setStatus(STATUS.IDLE)
    setResult(null)
    setError('')
    setFeatureKey('')
  }

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })

  const StatusCard = () => {
    if (status === STATUS.IDLE) return null

    if (status === STATUS.LOADING) {
      return (
        <div className="card text-center py-10 mt-6">
          <div className="inline-flex items-center gap-3 text-gray-400">
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <span className="text-sm">Checking feature flag…</span>
          </div>
        </div>
      )
    }

    if (status === STATUS.ENABLED) {
      return (
        <div className="mt-6 rounded-xl border border-green-700 bg-green-950 p-6 text-center">
          <div className="text-5xl mb-3">✅</div>
          <h3 className="text-green-300 font-bold text-xl mb-1">Feature is Enabled</h3>
          <p className="text-green-400 text-sm mb-3">
            <span className="font-mono font-semibold">{result?.feature_key}</span> is{' '}
            <span className="font-semibold">active</span> for this organisation.
          </p>
          <span className="badge bg-green-900 text-green-300">ENABLED</span>
        </div>
      )
    }

    if (status === STATUS.DISABLED) {
      return (
        <div className="mt-6 rounded-xl border border-red-800 bg-red-950 p-6 text-center">
          <div className="text-5xl mb-3">🚫</div>
          <h3 className="text-red-300 font-bold text-xl mb-1">Feature is Disabled</h3>
          <p className="text-red-400 text-sm mb-3">
            <span className="font-mono font-semibold">{result?.feature_key}</span> exists but is{' '}
            <span className="font-semibold">turned off</span> for this organisation.
          </p>
          <span className="badge bg-red-900 text-red-300">DISABLED</span>
        </div>
      )
    }

    if (status === STATUS.NOT_FOUND) {
      return (
        <div className="mt-6 rounded-xl border border-yellow-800 bg-yellow-950 p-6 text-center">
          <div className="text-5xl mb-3">❓</div>
          <h3 className="text-yellow-300 font-bold text-xl mb-1">Flag Not Found</h3>
          <p className="text-yellow-400 text-sm mb-3">
            <span className="font-mono font-semibold">{result?.feature_key}</span> does not exist
            for this organisation.
          </p>
          <span className="badge bg-yellow-900 text-yellow-300">NOT FOUND</span>
        </div>
      )
    }

    return null
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-2xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <div>
              <span className="font-semibold text-white">Flagsmith</span>
              <span className="ml-2 badge bg-emerald-900 text-emerald-300">Feature Check</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">
        {/* Page title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Check Feature Status</h1>
          <p className="text-gray-400 text-sm">
            Enter a feature key and select your organisation to check if the feature is enabled.
          </p>
        </div>

        {/* Check form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="px-4 py-3 bg-red-900 border border-red-700 text-red-200 text-sm rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Organisation
              </label>
              {orgsLoading ? (
                <div className="input-field text-gray-500 cursor-not-allowed">
                  Loading organisations…
                </div>
              ) : (
                <select
                  value={organisationId}
                  onChange={(e) => {
                    setOrganisationId(e.target.value)
                    setStatus(STATUS.IDLE)
                    setResult(null)
                    setError('')
                  }}
                  className="input-field"
                >
                  <option value="">Select your organisation</option>
                  {organisations.map((org) => (
                    <option key={org._id} value={org._id}>
                      {org.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Feature Key
              </label>
              <input
                type="text"
                value={featureKey}
                onChange={(e) => {
                  setFeatureKey(e.target.value)
                  setStatus(STATUS.IDLE)
                  setResult(null)
                  setError('')
                }}
                placeholder="e.g. dark_mode or new_checkout"
                className="input-field font-mono"
              />
              <p className="text-gray-600 text-xs mt-1">
                Lowercase letters, numbers, and underscores only.
              </p>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={status === STATUS.LOADING || orgsLoading}
                className="btn-primary"
              >
                {status === STATUS.LOADING ? 'Checking…' : 'Check Feature'}
              </button>
              {status !== STATUS.IDLE && status !== STATUS.LOADING && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="py-2.5 px-4 bg-gray-700 hover:bg-gray-600 text-gray-100 font-semibold rounded-lg transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Result card */}
        <StatusCard />

        {/* Check history */}
        {history.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                Recent Checks
              </h2>
              <button
                onClick={() => setHistory([])}
                className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
              >
                Clear
              </button>
            </div>
            <div className="space-y-2">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg hover:border-gray-700 transition-colors cursor-pointer"
                  onClick={() => {
                    setFeatureKey(item.feature_key)
                    const org = organisations.find((o) => o.name === item.organisation)
                    if (org) setOrganisationId(org._id)
                    setStatus(STATUS.IDLE)
                    setResult(null)
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm">
                      {!item.exists ? '❓' : item.enabled ? '✅' : '🚫'}
                    </span>
                    <div>
                      <span className="font-mono text-white text-sm font-medium">
                        {item.feature_key}
                      </span>
                      <p className="text-gray-500 text-xs">{item.organisation}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`badge ${
                        !item.exists
                          ? 'bg-yellow-900 text-yellow-300'
                          : item.enabled
                          ? 'bg-green-900 text-green-300'
                          : 'bg-red-900 text-red-300'
                      }`}
                    >
                      {!item.exists ? 'not found' : item.enabled ? 'enabled' : 'disabled'}
                    </span>
                    <p className="text-gray-600 text-xs mt-0.5">{formatTime(item.checkedAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default CheckPage;