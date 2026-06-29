import { useAuth } from './context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <div>
            <span className="font-semibold text-white">Flagsmith</span>
            <span className="ml-2 badge bg-violet-900 text-violet-300">Org Admin</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm text-white font-medium">{user?.name}</p>
            <p className="text-xs text-gray-400">{user?.organisation?.name}</p>
          </div>
          <button onClick={handleLogout} className="btn-secondary text-sm py-1.5 px-3">
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar;