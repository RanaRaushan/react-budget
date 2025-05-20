import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Outlet } from 'react-router-dom'
import { AuthProvider } from './hooks/AuthProvider.jsx'
// import LogoutPage from './pages/Login/logout.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
      {/* <LogoutPage /> */}
      {/* <Outlet /> */}
    </AuthProvider>
  </StrictMode>,
)
