import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './layouts/AppLayout'
import Orders from './pages/Orders'
import Profile from './pages/Profile'
import Masters from './pages/Masters'
import Master from './pages/Master'


function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Orders />} />
        <Route path="/masters" element={<Masters />} />
        <Route path="/masters/:id" element={<Master />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App;