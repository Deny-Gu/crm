import { Outlet } from 'react-router-dom'
import React from 'react'
import Navigation from '../components/Navigation'
import { useAuth } from '../providers/AuthProvider'
import { CSpinner } from '@coreui/react'

const AppLayout: React.FC = () => {
  const { ready } = useAuth()

  if (!ready) return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <CSpinner />
    </div>
  )

  return (
    <div className="min-vh-100 d-flex flex-column">
      <Navigation />
      <main className="flex-grow-1">
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
