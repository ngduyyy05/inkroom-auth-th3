import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { api, authHeaders } from '../api'

const AuthContext = createContext(null)
const STORAGE_KEY = 'inkroom-auth'

function readSession() {
  try {
    const session = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return session?.token && Date.parse(session.expiresAt) > Date.now() ? session : null
  } catch { return null }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sessionError, setSessionError] = useState('')
  const generation = useRef(0)

  const save = useCallback(value => {
    generation.current++
    if (value) localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    else localStorage.removeItem(STORAGE_KEY)
    setSession(value)
    setSessionError('')
  }, [])

  const restore = useCallback(async () => {
    const current = ++generation.current
    const saved = readSession()
    setLoading(true)
    setSessionError('')
    try {
      if (!saved) { localStorage.removeItem(STORAGE_KEY); setSession(null); return }
      const { data: user } = await api.get('/auth/me', authHeaders(saved.token))
      if (current === generation.current) {
        const verified = { ...saved, user }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(verified))
        setSession(verified)
      }
    } catch (error) {
      if (current !== generation.current) return
      setSession(null)
      if (error.response?.status === 401) localStorage.removeItem(STORAGE_KEY)
      else setSessionError('Chưa thể xác minh phiên đăng nhập. Hãy kiểm tra máy chủ rồi thử lại.')
    } finally {
      if (current === generation.current) setLoading(false)
    }
  }, [save])

  useEffect(() => {
    restore()
    const sync = event => { if (event.key === STORAGE_KEY || event.key === null) restore() }
    window.addEventListener('storage', sync)
    return () => { generation.current++; window.removeEventListener('storage', sync) }
  }, [restore])

  useEffect(() => {
    if (!session) return
    const timer = setTimeout(() => save(null), Math.max(0, Date.parse(session.expiresAt) - Date.now()))
    return () => clearTimeout(timer)
  }, [session, save])

  async function login(email, password) {
    const { data } = await api.post('/auth/login', { email: email.trim(), password })
    save(data)
  }

  async function register(email, password) {
    await api.post('/auth/register', { email: email.trim(), password })
  }

  async function logout() {
    // Chỉ hoàn tất đăng xuất khi máy chủ đã thu hồi token; lỗi mạng cho phép thử lại.
    if (session) await api.post('/auth/logout', {}, authHeaders(session.token))
    save(null)
  }

  return <AuthContext.Provider value={{ user: session?.user ?? null, loading, sessionError, retry: restore, login, register, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
