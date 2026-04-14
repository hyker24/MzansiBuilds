import { useNavigate } from 'react-router-dom'
import { useProfile } from '../hooks/useProfile'
import { useAuth } from '../context/AuthContext'
import { useProjects } from '../hooks/useProjects'
import Navbar from '../Components/NavBar'
import ProjectCard from '../Components/ProjectCard'
//import CollaborationRequests from '../Components/CollaborationRequests'

export default function Profile() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { profile, loading } = useProfile()

  const { projects, loading: projectsLoading } = useProjects(user?.id)

  const getInitials = (name) => {
    if (!name) return '?'
    return name.split(' ')
      .map(w => w[0]).join('')
      .toUpperCase().slice(0, 2)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric', month: 'long'
    })
  }

  if (loading) return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.center}>
        <div style={styles.spinner} />
      </div>
    </div>
  )

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.content}>

        {/* Profile card */}
        <div style={styles.profileCard}>
          <div style={styles.profileLeft}>
            {/* Avatar */}
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.username}
                style={styles.avatar}
              />
            ) : (
              <div style={styles.avatarFallback}>
                {getInitials(profile?.username)}
              </div>
            )}

            {/* Info */}
            <div>
              <h2 style={styles.username}>{profile?.username}</h2>
              <p style={styles.email}>{user?.email}</p>
              {profile?.bio && (
                <p style={styles.bio}>{profile.bio}</p>
              )}
              <p style={styles.joined}>
                Joined {profile?.created_at
                  ? formatDate(profile.created_at)
                  : ''}
              </p>
            </div>
          </div>

          {/* Edit button */}
          <button
            style={styles.editBtn}
            onClick={() => navigate('/edit-profile')}
          >
            Edit profile
          </button>
        </div>

        {/* Stats row */}
        <div style={styles.statsRow}>
          <div style={styles.stat}>
            <span style={styles.statNum}>{projects.length}</span>
            <span style={styles.statLabel}>Projects</span>
          </div>
          <div style={styles.stat}>
            <span style={styles.statNum}>
              {projects.filter(p => p.is_completed).length}
            </span>
            <span style={styles.statLabel}>Completed</span>
          </div>
          <div style={styles.stat}>
            <span style={styles.statNum}>
              {projects.filter(p => p.stage === 'in progress').length}
            </span>
            <span style={styles.statLabel}>In Progress</span>
          </div>
        </div>

        {/* User's projects */}
        <div style={styles.projectsSection}>
          <h3 style={styles.sectionTitle}>
            Projects ({projects.length})
          </h3>

          {projectsLoading ? (
            <div style={styles.center}>
              <div style={styles.spinner} />
            </div>
          ) : projects.length === 0 ? (
            <div style={styles.emptyState}>
              <p style={{ color: '#888', marginBottom: 12 }}>
                You haven't shared any projects yet.
              </p>
              <button
                style={styles.newProjectBtn}
                onClick={() => navigate('/create-project')}
              >
                Share your first project
              </button>
            </div>
          ) : (
            <div style={styles.grid}>
              {projects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
        <div style={{ marginTop: 28 }}>
          <CollaborationRequests />
        </div>

      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#111',
    fontFamily: 'DM Sans, sans-serif',
  },
  center: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
  },
  spinner: {
    width: 32, height: 32,
    border: '3px solid #e2e2de',
    borderTop: '3px solid #1a7a4a',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  content: {
    maxWidth: 900,
    margin: '0 auto',
    padding: '32px 24px',
  },
  profileCard: {
    background: '#fff',
    border: '1px solid #e2e2de',
    borderRadius: 12,
    padding: '24px',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 20,
  },
  profileLeft: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 18,
  },
  avatar: {
    width: 72, height: 72,
    borderRadius: '50%',
    objectFit: 'cover',
    flexShrink: 0,
  },
  avatarFallback: {
    width: 72, height: 72,
    borderRadius: '50%',
    background: '#1a7a4a',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 24,
    fontWeight: 700,
    flexShrink: 0,
  },
  username: {
    fontSize: 20,
    fontWeight: 700,
    color: '#0d0d0d',
    margin: '0 0 4px',
  },
  email: {
    fontSize: 13,
    color: '#888',
    margin: '0 0 8px',
  },
  bio: {
    fontSize: 13,
    color: '#555',
    lineHeight: 1.6,
    margin: '0 0 8px',
    maxWidth: 400,
  },
  joined: {
    fontSize: 12,
    color: '#aaa',
    margin: 0,
  },
  editBtn: {
    padding: '8px 18px',
    background: '#fff',
    border: '1px solid #e2e2de',
    borderRadius: 8,
    fontSize: 13,
    cursor: 'pointer',
    fontFamily: 'DM Sans, sans-serif',
    color: '#555',
    flexShrink: 0,
  },
  statsRow: {
    display: 'flex',
    gap: 16,
    marginBottom: 28,
  },
  stat: {
    flex: 1,
    background: '#fff',
    border: '1px solid #e2e2de',
    borderRadius: 10,
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  },
  statNum: {
    fontSize: 24,
    fontWeight: 700,
    color: '#1a7a4a',
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
  },
  projectsSection: {
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#0d0d0d',
    marginBottom: 16,
  },
  emptyState: {
    textAlign: 'center',
    padding: '48px 20px',
    background: '#fff',
    border: '1px solid #e2e2de',
    borderRadius: 12,
  },
  newProjectBtn: {
    padding: '10px 20px',
    background: '#1a7a4a',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'DM Sans, sans-serif',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
    gap: 16,
  },
} 