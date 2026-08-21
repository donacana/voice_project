import React from 'react'
import './MainLayout.css'
import { MobileRemoteIndicator } from './MobileRemoteIndicator'
import type { RemoteStatus } from '../services/voice'

interface MainLayoutProps {
  children: React.ReactNode
  _title?: string
  backendStatus?: string
  remoteStatus?: RemoteStatus
}

export const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  backendStatus,
  remoteStatus = 'offline'
}) => {
  return (
    <div className="main-layout">
      <header className="layout-header">
        <div className="header-content">
          <h1>React UI Voice Lecture</h1>
          <p className="subtitle">Voice-Controlled UI Library Presentation</p>
        </div>
        <div className="header-status">
          <MobileRemoteIndicator status={remoteStatus} />
          {backendStatus && <span className="status-badge">{backendStatus}</span>}
        </div>
      </header>

      <main className="layout-main">
        {children}
      </main>

      <footer className="layout-footer">
        <p>&copy; 2024 Voice Lecture Project. Development in progress.</p>
      </footer>
    </div>
  )
}
