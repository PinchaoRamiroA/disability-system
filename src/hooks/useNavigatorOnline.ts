import { useEffect, useState } from 'react'

export const useNavigatorOnline = () => {
  const [isOnline, setIsOnline] = useState(
    typeof window !== 'undefined' ? window.navigator.onLine : true
  )

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    // Agregar event listeners para detectar cambios en la conexión
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Eliminar los event listeners al desmontar el componente
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return {
    isOnline,
  }
}
