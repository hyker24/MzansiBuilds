import { useState } from 'react'
import { useAuth } from '../context/Auth'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const { signUpWithEmail, signInWithGoogle } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e) => {
    e.preventDefault()

    // Basic validation before even hitting Supabase
    if (password.length < 6) {
      return setError('Password must be at least 6 characters')
    }
    if (username.length < 3) {
      return setError('Username must be at least 3 characters')
    }

    try {
      setError('')
      setLoading(true)
      await signUpWithEmail(email, password, username)
      navigate('/feed')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <h1>Join MzansiBuilds</h1>

      {error && <p className="error">{error}</p>}

      <button onClick={signInWithGoogle}>
        Sign up with Google
      </button>

      <div className="divider">or</div>

      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p>Already have an account? <a href="/login">Sign in</a></p>
    </div>
  )
}