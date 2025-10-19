import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { AuthContextValue, Credentials } from '../types'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { signIn, signOut, refresh, fetchMe } from '../auth/authSlice'

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const dispatch = useAppDispatch()
  const { user, error } = useAppSelector((s) => s.auth)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await dispatch(refresh()).then(() => 
          dispatch(fetchMe())
        )
      } catch {
        // неавторизован — оставляем user = null
      } finally {
        if (!cancelled) setReady(true)
      }
    })()
    return () => { cancelled = true }
  }, [dispatch])

  const value = useMemo<AuthContextValue>(
  () => ({
    user,
    ready,
    error,
    signIn: (credentials: Credentials) => dispatch(signIn(credentials)).unwrap(),
    signOut: () => dispatch(signOut()),
    refresh: () => dispatch(refresh()),
  }), [user, ready, error, dispatch])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}