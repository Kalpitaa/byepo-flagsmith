import { useEffect } from 'react'

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500)
    return () => clearTimeout(timer)
  }, [onClose])

  const styles = {
    success: 'bg-green-900 border-green-700 text-green-200',
    error: 'bg-red-900 border-red-700 text-red-200',
  }

  return (
    <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border ${styles[type]} shadow-xl max-w-sm`}>
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-auto opacity-70 hover:opacity-100">✕</button>
    </div>
  )
}

export default Toast