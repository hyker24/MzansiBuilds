import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useProfile } from '../hooks/useProfile'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const { profile } = useProfile()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }
   const avatarUrl = profile?.avatar_url|| user?.user_metadata?.avatar_url;
  const getInitials = () => {
    const name = user?.user_metadata?.full_name || user?.email || ''
    return name.slice(0, 2).toUpperCase()
  }

  return (
    <nav style={styles.nav}>
      <div
        style={styles.logo}
        onClick={() => navigate('/feed')}
      >
        <div style={styles.logoDot} />
        MzansiBuilds
      </div>

      <div style={styles.actions}>
        <button
          style={styles.wallBtn}
          onClick={() => navigate('/celebration-wall')}
        >
          Wall
      </button>
        <button
          style={styles.addBtn}
          onClick={() => navigate('/create-project')}
        >
          + New project
        </button>

        <div
          style={styles.avatar}
          onClick={() => navigate('/profile')}
          title={user?.email}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="profile"
              referrerPolicy="no-referrer"
              style={{ width: '100%', height: '100%',
                borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            getInitials()
          )}
        </div>

        <button style={styles.signOutBtn} onClick={handleSignOut}>
          Sign out
        </button>
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 28px',
    background: '#494747',
    borderBottom: '1px solid #e2e2de',
    position: 'sticky',
    top: 0,
    zIndex: 100, 
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '16px',
    fontWeight: '700',
    color: '#0f6913',
    cursor: 'pointer',
    fontFamily: 'DM Sans, sans-serif',
  },
  logoDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#1a7a4a',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  addBtn: {
    padding: '8px 16px',
    background: '#1a7a4a',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: 'DM Sans, sans-serif',
  },
  wallBtn: {
  padding: '8px 14px',
  background: 'transparent',
  color: '#1a7a4a',
  border: '1px solid #e2e2de',
  borderRadius: '8px',
  fontSize: '13px',
  cursor: 'pointer',
  fontFamily: 'DM Sans, sans-serif',
},
  avatar: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    background: '#0d0d0d',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    overflow: 'hidden',
  },
  signOutBtn: {
    padding: '8px 14px',
    background: 'transparent',
    color: '#1a7a4a',
    border: '1px solid #e2e2de',
    borderRadius: '8px',
    fontSize: '13px',
    cursor: 'pointer',
    fontFamily: 'DM Sans, sans-serif',
  },
}