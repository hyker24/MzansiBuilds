import { useState } from 'react'
import { useAuth } from '../context/Auth'
import { useNavigate, Link } from 'react-router-dom'
import './Login.css'

export default function Login() {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth()
  const navigate = useNavigate()

  // State Management
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('') // Added for Sign Up
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGoogleLogin = async () => {
    try {
      setError('')
      await signInWithGoogle()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleAuthSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isLogin) {
        await signInWithEmail(email, password)
        navigate('/feed')
      } else {
        await signUpWithEmail(email, password, fullName)
        setError('Check your email to confirm your account!')
      }
    } catch (err) {
      setError(err.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-layout">
      {/* Left Side: Hero Section */}
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-logo-row">
            <div className="auth-logo-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className="auth-brand-name">MzansiBuilds</span>
          </div>
          <h1 className="auth-hero-title">Welcome to the future</h1>
          <p className="auth-hero-sub">Join thousands of users building something extraordinary. Start your journey today.</p>
        </div>
      </div>

      {/* Right Side: Form Section */}
      <div className="auth-right">
        <div className={`auth-form-wrapper ${!isLogin ? 'show-name' : ''}`}>
          
          {/* Mobile Logo */}
          <div className="auth-mobile-logo">
            <div className="auth-logo-icon-sm">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111' }}>MzansiBuilds</span>
          </div>

          <div className="auth-heading">
            <h2>{isLogin ? 'Sign in to your account' : 'Create your account'}</h2>
            <p>{isLogin ? 'Welcome back! Please enter your details.' : 'Get started with your free account today.'}</p>
          </div>

          {error && <p className="error" style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

          <button className="btn-google" type="button" onClick={handleGoogleLogin}>
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="auth-divider">
            <div className="auth-divider-line"><hr /></div>
            <div className="auth-divider-text"><span>or</span></div>
          </div>

          <form className="auth-form" onSubmit={handleAuthSubmit}>
            {!isLogin && (
              <div className="auth-field name-field">
                <label htmlFor="name">Full name</label>
                <input 
                  id="name" 
                  type="text" 
                  placeholder="John Doe" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required={!isLogin}
                />
              </div>
            )}
            
            <div className="auth-field">
              <label htmlFor="email">Email</label>
              <input 
                id="email" 
                type="email" 
                placeholder="you@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>

            <div className="auth-field">
              <div className="auth-password-header">
                <label htmlFor="password">Password</label>
                {isLogin && <a href="#" id="forgotLink">Forgot password?</a>}
              </div>
              <input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Processing...' : (isLogin ? 'Sign in' : 'Create account')}
            </button>
          </form>

          <p className="auth-toggle">
            <span>{isLogin ? "Don't have an account? " : "Already have an account? "}</span>
            <a onClick={() => setIsLogin(!isLogin)} style={{ cursor: 'pointer' }}>
              {isLogin ? 'Sign up' : 'Sign in'}
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}