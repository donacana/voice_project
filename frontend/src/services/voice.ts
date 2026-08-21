/**
 * Android Remote command receiver.
 *
 * The PC browser is NO LONGER the microphone input device.
 * The Android phone is the Push-to-Talk microphone remote.
 *
 * Flow:
 *   Android Push-to-Talk
 *   → FastAPI /api/ws/android
 *   → existing Deepgram STT + command routing
 *   → CommandAction broadcast
 *   → FastAPI /api/ws/commands
 *   → this receiver
 *   → onAction callback → existing handleVoiceAction → React navigation
 *
 * This service does NOT capture browser microphone audio.
 */
export interface CommandAction {
  action: string
  library_key: string | null
  screen: string | null
  content_type: string | null
  confidence: number
  source: string
}

export interface VoiceContextPayload {
  current_library: string
  previous_library: string | null
  current_screen: string
  current_content_type: string
}

export type RemoteStatus = 'connected' | 'offline'

export interface CommandCallbacks {
  onAction: (action: CommandAction, text: string, intent: string) => void
  onRemoteStatus?: (status: RemoteStatus) => void
  onError?: (message: string) => void
}

// Same-origin WebSocket URL supporting both HTTP (ws://) and HTTPS (wss://).
// Works with the existing Vite/backend proxy architecture. No hardcoded host.
const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
const WS_URL = `${protocol}//${window.location.host}/api/ws/commands`
const RECONNECT_DELAY_MS = 2000

export class CommandReceiver {
  private callbacks: CommandCallbacks
  private context: VoiceContextPayload
  private ws: WebSocket | null = null
  private manuallyClosed = false
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null

  constructor(callbacks: CommandCallbacks, context: VoiceContextPayload) {
    this.callbacks = callbacks
    this.context = context
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN
  }

  updateContext(context: Partial<VoiceContextPayload>): void {
    this.context = { ...this.context, ...context }
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'context', ...this.context }))
    }
  }

  connect(): void {
    // Prevent duplicate connections while CONNECTING or OPEN.
    if (
      this.ws &&
      (this.ws.readyState === WebSocket.CONNECTING || this.ws.readyState === WebSocket.OPEN)
    ) {
      return
    }
    this.manuallyClosed = false

    this.ws = new WebSocket(WS_URL)

    this.ws.onopen = () => {
      this.ws?.send(JSON.stringify({ type: 'context', ...this.context }))
    }

    this.ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data as string)
        if (msg.type === 'remote_status') {
          // Only accept known status values; ignore malformed ones.
          if (msg.status === 'connected' || msg.status === 'offline') {
            this.callbacks.onRemoteStatus?.(msg.status)
          }
        } else if (msg.type === 'action') {
          // Only execute well-formed actions with a non-empty (trimmed) action name.
          if (typeof msg.action === 'string' && msg.action.trim().length > 0) {
            const action: CommandAction = {
              action: msg.action,
              library_key: msg.library_key ?? null,
              screen: msg.screen ?? null,
              content_type: msg.content_type ?? null,
              confidence: msg.confidence ?? 0,
              source: msg.source ?? '',
            }
            this.callbacks.onAction(action, msg.text ?? '', msg.intent ?? '')
          }
        } else if (msg.type === 'error') {
          this.callbacks.onError?.(msg.message ?? 'Command error')
        }
      } catch {
        // ignore non-JSON frames
      }
    }

    this.ws.onerror = () => {
      this.callbacks.onError?.('Command connection error')
    }

    this.ws.onclose = () => {
      this.ws = null
      if (!this.manuallyClosed) {
        this.callbacks.onRemoteStatus?.('offline')
        this.scheduleReconnect()
      }
    }
  }

  private scheduleReconnect(): void {
    // Only one reconnect timer may exist.
    if (this.reconnectTimer !== null) return
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null
      this.connect()
    }, RECONNECT_DELAY_MS)
  }

  close(): void {
    this.manuallyClosed = true
    // Clear any pending reconnect timer so manual close never reconnects.
    if (this.reconnectTimer !== null) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
    if (this.ws) {
      this.ws.close()
    }
    this.ws = null
  }
}