import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router'
import { ArrowUpRight, ShieldCheck } from 'lucide-react'
import { useAuth } from './AuthContext'
import { errorMessage } from '../api'

export function AuthStatus() {
  const { loading, sessionError, retry } = useAuth()
  return <section className="auth-status" aria-live="polite">{loading ? 'Đang xác minh phiên đăng nhập…' : <><p role="alert">{sessionError}</p><button className="button button-dark" onClick={retry}>Thử lại</button></>}</section>
}

export function ProtectedRoute({ children }) {
  const { user, loading, sessionError } = useAuth()
  const location = useLocation()
  if (loading || sessionError) return <AuthStatus/>
  return user ? children : <Navigate to="/login" replace state={{ from: location.pathname }}/>
}

export function AuthPage({ mode }) {
  const isRegister = mode === 'register'
  const { user, loading, login, register } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: location.state?.email || '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const from = location.state?.from
  const destination = typeof from === 'string' && from.startsWith('/') && !from.startsWith('//') && !['/login', '/register'].includes(from) ? from : '/account'
  if (loading) return <AuthStatus/>
  if (user) return <Navigate to={destination} replace/>

  async function submit(event) {
    event.preventDefault()
    if (busy) return
    const next = {}
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) || form.email.trim().length > 254) next.email = 'Vui lòng nhập email hợp lệ.'
    if (form.password.length < 8 || form.password.length > 128) next.password = 'Mật khẩu phải có từ 8 đến 128 ký tự.'
    if (isRegister && form.confirm !== form.password) next.confirm = 'Mật khẩu xác nhận không khớp.'
    setErrors(next)
    setError('')
    if (Object.keys(next).length) return
    setBusy(true)
    try {
      if (isRegister) {
        await register(form.email, form.password)
        navigate('/login', { replace: true, state: { from: destination, registered: true, email: form.email.trim() } })
      } else {
        await login(form.email, form.password)
        navigate(destination, { replace: true })
      }
    } catch (err) { setError(errorMessage(err)) }
    finally { setBusy(false) }
  }

  const field = (name, title, type, autoComplete) => <div><label htmlFor={name}>{title}<input id={name} name={name} type={type} autoComplete={autoComplete} value={form[name]} onChange={event => setForm({ ...form, [name]: event.target.value })} required maxLength={name === 'email' ? 254 : 128} aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `${name}-error` : undefined}/></label>{errors[name] && <p id={`${name}-error`} className="field-error">{errors[name]}</p>}</div>
  return <section className="auth-section"><div className="container auth-grid"><div className="auth-intro"><div className="eyebrow"><span/> INKROOM / TÀI KHOẢN</div><h1>Câu chuyện của bạn,<br/><em>bắt đầu từ đây.</em></h1><p>{isRegister ? 'Tạo tài khoản để bắt đầu đặt lịch tư vấn và tìm phong cách xăm của riêng bạn.' : 'Chào mừng bạn trở lại. Đăng nhập để tiếp tục hành trình cùng INKROOM.'}</p><div className="auth-note"><ShieldCheck size={22}/><span>Một tài khoản cho những dấu ấn của riêng bạn.</span></div></div><form className="booking-form auth-form" onSubmit={submit} noValidate><div className="form-heading"><span>{isRegister ? 'THAM GIA INKROOM' : 'CHÀO MỪNG TRỞ LẠI'}</span><h2>{isRegister ? 'Đăng ký' : 'Đăng nhập'}</h2></div>{!isRegister && location.state?.registered && <p className="auth-success" role="status">Đăng ký thành công! Hãy đăng nhập bằng tài khoản vừa tạo.</p>}{field('email', 'Email', 'email', 'email')}{field('password', 'Mật khẩu', 'password', isRegister ? 'new-password' : 'current-password')}{isRegister && <><small className="password-hint">Sử dụng từ 8 đến 128 ký tự.</small>{field('confirm', 'Xác nhận mật khẩu', 'password', 'new-password')}</>}{error && <p className="form-error" role="alert">{error}</p>}<button className="button button-dark submit-button" disabled={busy} type="submit">{busy ? 'Đang xử lý…' : isRegister ? 'Tạo tài khoản' : 'Đăng nhập'}<ArrowUpRight size={18}/></button><p className="auth-switch">{isRegister ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'} <Link to={isRegister ? '/login' : '/register'} state={{ from: destination }}>{isRegister ? 'Đăng nhập' : 'Đăng ký ngay'}</Link></p></form></div></section>
}

export function AccountPage() {
  const { user, logout } = useAuth()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit() {
    setBusy(true)
    setError('')
    try { await logout() } catch (err) { setError(errorMessage(err)) } finally { setBusy(false) }
  }
  return <section className="section"><div className="container account-card"><div className="eyebrow"><span/> TÀI KHOẢN INKROOM</div><h1>Chào mừng bạn.</h1><p>Bạn đã đăng nhập với email <strong>{user.email}</strong>.</p><p>Ngày tham gia: {new Date(user.createdAt).toLocaleDateString('vi-VN')}</p><div className="account-actions"><Link className="button button-dark" to="/booking">Đặt lịch tư vấn <ArrowUpRight size={18}/></Link><button className="button" disabled={busy} onClick={submit}>{busy ? 'Đang đăng xuất…' : 'Đăng xuất'}</button></div>{error && <p className="form-error" role="alert">{error}</p>}</div></section>
}
