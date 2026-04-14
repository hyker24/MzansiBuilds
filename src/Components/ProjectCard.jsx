import { useNavigate } from 'react-router-dom'

export default function ProjectCard({ project }) {
  const navigate = useNavigate()

  const getStageStyle = (stage) => {
    const stages = {
      'idea':        { label: 'Idea',        bg: '#E1F5EE', color: '#085041' },
      'in progress': { label: 'In Progress', bg: '#E6F1FB', color: '#0C447C' },
      'launched':    { label: 'Launched',    bg: '#EEEDFE', color: '#3C3489' },
      'completed':   { label: 'Completed',   bg: '#EAF3DE', color: '#27500A' },
    }
    return stages[stage] || { label: stage, bg: '#f4f4f2', color: '#888' }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric', month: 'short', day: 'numeric'
    })
  }

  const getInitials = (username) => {
    if (!username) return '?'
    return username.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  }

  const commentCount = project.comments?.[0]?.count ?? 0
  const stage = getStageStyle(project.stage)

  return (
    <div
      style={styles.card}
      onClick={() => navigate(`/project/${project.id}`)}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = '#c0bfba'
        e.currentTarget.style.transform = 'translateY(-1px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = '#e8e7e2'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      <div style={styles.topRow}>
        <div style={styles.authorRow}>
          {project.profiles?.avatar_url ? (
            <img
              src={project.profiles.avatar_url}
              alt={project.profiles.username}
              style={styles.avatar}
            />
          ) : (
            <div style={styles.avatarFallback}>
              {getInitials(project.profiles?.username)}
            </div>
          )}
          <div>
            <div style={styles.authorName}>
              {project.profiles?.username || 'Anonymous'}
            </div>
            <div style={styles.date}>{formatDate(project.created_at)}</div>
          </div>
        </div>

        <span style={{ ...styles.stageBadge, background: stage.bg, color: stage.color }}>
          {stage.label}
        </span>
      </div>

      
      <h3 style={styles.title}>{project.name}</h3>

      
      <p style={styles.description}>
        {project.description?.slice(0, 120)}
        {project.description?.length > 120 ? '…' : ''}
      </p>

      
      {project.support_needed && (
        <div style={styles.supportTag}>
          Looking for: {project.support_needed}
        </div>
      )}

      
      <div style={styles.footer}>
        <div style={styles.footerLeft}>
          <div style={styles.footerStat}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path
                d="M11 1H2C1.45 1 1 1.45 1 2v7c0 .55.45 1 1 1h2v2l2.5-2H11c.55 0 1-.45 1-1V2c0-.55-.45-1-1-1z"
                stroke="#aaa"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
            </svg>
            <span style={styles.footerStatText}>
              {commentCount} comment{commentCount !== 1 ? 's' : ''}
            </span>
          </div>

          {project.is_completed && (
            <span style={styles.completedPill}>Completed</span>
          )}
        </div>

        {project.repo_url && (
          
         <a   href={project.repo_url}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.repoLink}
            onClick={e => e.stopPropagation()}
          >
            View repo →
          </a>
        )}
      </div>
    </div>
  )
}

const styles = {
  card: {
    background: '#ffffff',
    border: '0.5px solid #e8e7e2',
    borderRadius: 12,
    padding: 20,
    cursor: 'pointer',
    transition: 'border-color 0.15s, transform 0.1s',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    fontFamily: 'DM Sans, sans-serif',
  },
  topRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  authorRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 9,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    objectFit: 'cover',
    flexShrink: 0,
  },
  avatarFallback: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: '#E1F5EE',
    color: '#085041',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: 500,
    flexShrink: 0,
  },
  authorName: {
    fontSize: 13,
    fontWeight: 500,
    color: '#0d0d0d',
    lineHeight: 1.3,
  },
  date: {
    fontSize: 11,
    color: '#aaa',
    marginTop: 2,
  },
  stageBadge: {
    fontSize: 11,
    fontWeight: 500,
    padding: '3px 10px',
    borderRadius: 20,
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  title: {
    fontSize: 15,
    fontWeight: 500,
    color: '#0d0d0d',
    lineHeight: 1.4,
    margin: 0,
  },
  description: {
    fontSize: 13,
    color: '#666',
    lineHeight: 1.65,
    margin: 0,
  },
  supportTag: {
    display: 'inline-block',
    background: '#f5f4f0',
    color: '#555',
    fontSize: 12,
    padding: '5px 11px',
    borderRadius: 8,
    border: '0.5px solid #e8e7e2',
    width: 'fit-content',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    marginTop: 2,
    borderTop: '0.5px solid #f0efeb',
  },
  footerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  footerStat: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
  },
  footerStatText: {
    fontSize: 12,
    color: '#aaa',
  },
  completedPill: {
    fontSize: 11,
    fontWeight: 500,
    color: '#27500A',
    background: '#EAF3DE',
    padding: '3px 9px',
    borderRadius: 20,
  },
  repoLink: {
    fontSize: 12,
    color: '#1a7a4a',
    textDecoration: 'none',
    fontWeight: 500,
  },
}