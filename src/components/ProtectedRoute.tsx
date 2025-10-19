import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../providers/AuthProvider'
import React from 'react'
import { CSpinner } from '@coreui/react'


const ProtectedRoute: React.FC<React.PropsWithChildren> = ({children}) => {
  const { user, ready } = useAuth()
  const location = useLocation()
  
  if (!ready) return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <CSpinner />
    </div>
  )

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return <>{children}</>
}


export default ProtectedRoute