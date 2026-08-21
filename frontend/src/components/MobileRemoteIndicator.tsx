import type { RemoteStatus } from '../services/voice'

interface MobileRemoteIndicatorProps {
  status: RemoteStatus
}

export function MobileRemoteIndicator({ status }: MobileRemoteIndicatorProps) {
  const connected = status === 'connected'
  return (
    <div className={`mobile-remote-indicator ${connected ? 'connected' : 'offline'}`}>
      <span className="mobile-remote-dot" />
      <span className="mobile-remote-text">
        {connected ? 'Mobile Remote Connected' : 'Mobile Remote Offline'}
      </span>
    </div>
  )
}