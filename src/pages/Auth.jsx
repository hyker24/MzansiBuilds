import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Auth() {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth()
  const navigate = useNavigate()

  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleGoogleAuth = async () => {
    try {
      setError('')
      await signInWithGoogle()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleEmailAuth = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!isLogin && username.length < 3) {
      return setError('Username must be at least 3 characters')
    }
    if (password.length < 6) {
      return setError('Password must be at least 6 characters')
    }

    try {
      setLoading(true)
      if (isLogin) {
        await signInWithEmail(email, password)
        navigate('/feed')
      } else {
        await signUpWithEmail(email, password, username)
        setMessage('Account created! Check your email to confirm.')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.left}>
        <div style={styles.leftContent}>
          <div style={styles.logoRow}>
            <div style={styles.logoIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="8" height="8" rx="2" fill="white" opacity="0.9"/>
                <rect x="13" y="3" width="8" height="8" rx="2" fill="white" opacity="0.6"/>
                <rect x="3" y="13" width="8" height="8" rx="2" fill="white" opacity="0.6"/>
                <rect x="13" y="13" width="8" height="8" rx="2" fill="white" opacity="0.3"/>
              </svg>
            </div>
            <span style={styles.logoText}>MzansiBuilds</span>
          </div>
          <h1 style={styles.heading}>Build in public.<br />Grow together.</h1>
          <p style={styles.subtext}>
            The home for South African developers sharing what they're building
            and connecting with collaborators.
          </p>
         
        </div>
      </div>

      <div style={styles.right}>
        <div style={styles.form}>
          <h2 style={styles.formTitle}>
            {isLogin ? 'Welcome back' : 'Join MzansiBuilds'}
          </h2>
          <p style={styles.formSub}>
            {isLogin ? 'Sign in to your account' : 'Create your free account'}
          </p>

          {error && <div style={styles.error}>{error}</div>}
          {message && <div style={styles.success}>{message}</div>}

          <button style={styles.googleBtn} onClick={handleGoogleAuth}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div style={styles.divider}>
            <div style={styles.dividerLine}/>
            <span style={styles.dividerText}>or</span>
            <div style={styles.dividerLine}/>
          </div>

          <form onSubmit={handleEmailAuth}>
            {!isLogin && (
              <input
                style={styles.input}
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            )}
            <input
              style={styles.input}
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <input
              style={styles.input}
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              style={{
                ...styles.submitBtn,
                opacity: loading ? 0.7 : 1
              }}
              disabled={loading}
            >
              {loading
                ? 'Please wait...'
                : isLogin ? 'Sign in' : 'Create account'
              }
            </button>
          </form>

          <p style={styles.toggleText}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <span
              style={styles.toggleLink}
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
                setMessage('')
              }}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: 'DM Sans, sans-serif',
  },
  left: {
    flex: 1,
    background: '#0d0d0d',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 40px',
    position: 'relative',
    overflow: 'hidden',
  },
  leftContent: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '380px',
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '32px',
  },
  logoIcon: {
    width: '42px',
    height: '42px',
    borderRadius: '10px',
    background: '#1a7a4a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#ffffff',
  },
  heading: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#ffffff',
    lineHeight: '1.2',
    marginBottom: '16px',
  },
  subtext: {
    fontSize: '14px',
    color: '#888',
    lineHeight: '1.7',
    marginBottom: '40px',
  },
  statRow: {
    display: 'flex',
    gap: '32px',
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  statNum: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1a7a4a',
  },
  statLabel: {
    fontSize: '12px',
    color: '#666',
  },
  right: {
    flex: 1,
    background: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 40px',
  },
  form: {
    width: '100%',
    maxWidth: '360px',
  },
  formTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#19702f',
    marginBottom: '6px',
  },
  formSub: {
    fontSize: '14px',
    color: '#888',
    marginBottom: '28px',
  },
  error: {
    background: '#fff0f0',
    border: '1px solid #ffc0c0',
    color: '#cc0000',
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '13px',
    marginBottom: '16px',
  },
  success: {
    background: '#e8f7ef',
    border: '1px solid #b8e8cf',
    color: '#1a7a4a',
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '13px',
    marginBottom: '16px',
  },
  googleBtn: {
    width: '100%',
    padding: '12px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    border: '1px solid #e2e2de',
    borderRadius: '10px',
    background: '#ffffff',
    color: '#0d0d0d',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    marginBottom: '20px',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: '#e2e2de',
  },
  dividerText: {
    fontSize: '12px',
    color: '#aaa',
  },
  input: {
    width: '100%',
    padding: '11px 14px',
    border: '1px solid #e2e2de',
    borderRadius: '10px',
    fontSize: '14px',
    marginBottom: '12px',
    outline: 'none',
    fontFamily: 'DM Sans, sans-serif',
    color: '#deecdf',
    boxSizing: 'border-box',
  },
  submitBtn: {
    width: '100%',
    padding: '12px',
    background: '#1a7a4a',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '4px',
    fontFamily: 'DM Sans, sans-serif',
  },
  toggleText: {
    textAlign: 'center',
    fontSize: '13px',
    color: '#888',
    marginTop: '20px',
  },
  toggleLink: {
    color: '#1a7a4a',
    fontWeight: '600',
    cursor: 'pointer',
  },
}