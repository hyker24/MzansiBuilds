import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import Navbar from '../Components/NavBar'

export default function CelebrationWall() {
  const navigate = useNavigate()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchWall()
  }, [])

  async function fetchWall() {
    try {
      setLoading(true)

      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          profiles (
            id,
            username,
            avatar_url
          )
        `)
        .or('stage.eq.completed,is_completed.eq.true') 
        .order('created_at', { ascending: false })

      if (error) throw error
      setEntries(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric', month: 'short', day: 'numeric'
    })
  }

  const getInitials = (username) => {
    if (!username) return '?'
    return username.split(' ')
      .map(w => w[0]).join('')
      .toUpperCase().slice(0, 2)
  }

  if (loading) return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.center}>
        <div style={styles.spinner} />
        <p style={{ color: '#888', marginTop: 16 }}>Loading...</p>
      </div>
    </div>
  )

  if (error) return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.center}>
        <p style={{ color: '#cc0000' }}>Error: {error}</p>
      </div>
    </div>
  )

  return (
    <div style={styles.page}>
      <Navbar />

      {/* Hero banner */}
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.trophy}>🏆</div>
          <h1 style={styles.heroTitle}>Celebration Wall</h1>
          <p style={styles.heroSub}>
            South African developers who built in public and shipped it.
          </p>
          <div style={styles.countBadge}>
            {entries.length} completed project{entries.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      <div style={styles.content}>
        {entries.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyTitle}>No completed projects yet</p>
            <p style={styles.emptySub}>
              Be the first to ship and appear on the wall.
            </p>
            <button
              style={styles.ctaBtn}
              onClick={() => navigate('/create-project')}
            >
              Share a project
            </button>
          </div>
        ) : (
          <div style={styles.grid}>
            {entries.map((entry) => (
              <div
                key={entry.id}
                style={styles.card}
                onClick={() => navigate(`/project/${entry.id}`)}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#1a7a4a'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e2de'}
              >
                {/* Completed badge */}
                <div style={styles.completedBadge}>
                  Completed
                </div>

                {/* Author */}
                <div style={styles.authorRow}>
                  {entry.profiles?.avatar_url ? (
                    <img
                      src={entry.profiles.avatar_url}
                      alt={entry.profiles.username}
                      style={styles.avatar}
                    />
                  ) : (
                    <div style={styles.avatarFallback}>
                      {getInitials(entry.profiles?.username)}
                    </div>
                  )}
                  <div>
                    <div style={styles.authorName}>
                      {entry.profiles?.username || 'Anonymous'}
                    </div>
                    <div style={styles.featuredDate}>
                      Completed {formatDate(entry.created_at)}
                    </div>
                  </div>
                </div>

                {/* Project info */}
                <h3 style={styles.projectTitle}>
                  {entry.projects?.name}
                </h3>
                <p style={styles.projectDesc}>
                  {entry.projects?.description?.slice(0, 120)}
                  {entry.projects?.description?.length > 120 ? '...' : ''}
                </p>

                {/* Repo link */}
                {entry.projects?.repo_url && (
                  <a
                    href={entry.projects.repo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.repoLink}
                    onClick={e => e.stopPropagation()}
                  >
                    View repository →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
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
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
  },
  spinner: {
    width: 32, height: 32,
    border: '3px solid #e2e2de',
    borderTop: '3px solid #1a7a4a',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  hero: {
    background: '#0d0d0d',
    padding: '48px 24px',
    textAlign: 'center',
  },
  heroContent: {
    maxWidth: 500,
    margin: '0 auto',
  },
  trophy: {
    fontSize: 40,
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 700,
    color: '#fff',
    margin: '0 0 12px',
  },
  heroSub: {
    fontSize: 14,
    color: '#888',
    lineHeight: 1.7,
    marginBottom: 20,
  },
  countBadge: {
    display: 'inline-block',
    background: '#1a7a4a',
    color: '#fff',
    fontSize: 12,
    fontWeight: 500,
    padding: '5px 16px',
    borderRadius: 20,
  },
  content: {
    maxWidth: 900,
    margin: '0 auto',
    padding: '32px 24px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    background: '#fff',
    border: '1px solid #e2e2de',
    borderRadius: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#0d0d0d',
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 13,
    color: '#888',
    marginBottom: 20,
  },
  ctaBtn: {
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
  card: {
    background: '#fff',
    border: '1px solid #e2e2de',
    borderRadius: 12,
    padding: 20,
    cursor: 'pointer',
    transition: 'border-color 0.15s',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  completedBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    background: '#e8f7ef',
    color: '#1a7a4a',
    fontSize: 11,
    fontWeight: 500,
    padding: '4px 10px',
    borderRadius: 20,
    width: 'fit-content',
  },
  authorRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 36, height: 36,
    borderRadius: '50%',
    objectFit: 'cover',
    flexShrink: 0,
  },
  avatarFallback: {
    width: 36, height: 36,
    borderRadius: '50%',
    background: '#1a7a4a',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 13,
    fontWeight: 600,
    flexShrink: 0,
  },
  authorName: {
    fontSize: 13,
    fontWeight: 500,
    color: '#0d0d0d',
  },
  featuredDate: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#0d0d0d',
    margin: 0,
    lineHeight: 1.3,
  },
  projectDesc: {
    fontSize: 13,
    color: '#555',
    lineHeight: 1.6,
    margin: 0,
  },
  repoLink: {
    fontSize: 12,
    color: '#1a7a4a',
    textDecoration: 'none',
    fontWeight: 500,
    marginTop: 4,
  },
}