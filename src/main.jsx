import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from "@/components/ui/sonner"
import { ProfileProvider } from './context/ProfileContext.jsx'
import { ClientProvider } from './context/ClientContext.jsx'

createRoot(document.getElementById('root')).render(
  <ClientProvider>
    <ProfileProvider>
      <App />
      <Toaster richColors />
    </ProfileProvider>
  </ClientProvider>

)
