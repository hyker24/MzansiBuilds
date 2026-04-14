import { useState } from 'react'
import Navbar from '../Components/Navbar'
import ProjectCard from '../Components/ProjectCard'
import { useProjects } from '../hooks/useProjects'

export default function Feed() {
  const { projects, loading, error } = useProjects()
  const [searchTerm, setSearchTerm] = useState('')
  const [stageFilter, setStageFilter] = useState('all')

  const filteredProjects = projects.filter(project => {
    const matchesSearch =
      project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStage = stageFilter === 'all' || project.stage === stageFilter
    return matchesSearch && matchesStage
  })

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.content}>
        {/* Hero header */}
        <div style={styles.hero}>
          <p style={styles.eyebrow}>South Africa</p>
          <h1 style={styles.heading}>What's being built</h1>
          <p style={styles.subheading}>
            <strong style={{ color: '#0d0d0d', fontWeight: 500 }}>{projects.length}</strong>{' '}
            project{projects.length !== 1 ? 's' : ''} shared by SA developers
          </p>
        </div>

        {/* Filter bar */}
        <div style={styles.filterBar}>
          <div style={styles.searchWrap}>
            <svg style={styles.searchIcon} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="7" cy="7" r="4.5" /><line x1="10.5" y1="10.5" x2="14" y2="14" />
            </svg>
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          <div style={styles.divider} />

          <div style={styles.stageFilters}>
            {['all', 'idea', 'in progress', 'completed'].map(stage => (
              <button
                key={stage}
                onClick={() => setStageFilter(stage)}
                style={{
                  ...styles.filterBtn,
                  background: stageFilter === stage ? '#1a7a4a' : 'transparent',
                  color: stageFilter === stage ? '#ffffff' : '#666',
                  borderColor: stageFilter === stage ? '#1a7a4a' : '#e2e2de',
                }}
              >
                {stage === 'all' ? 'All' : stage.charAt(0).toUpperCase() + stage.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content area */}
        {loading ? (
          <div style={styles.centerMessage}>
            <div style={styles.spinner} />
            <p style={{ color: '#0c0b0b', marginTop: '14px', fontSize: '13px' }}>Loading projects…</p>
          </div>
        ) : error ? (
          <div style={styles.centerMessage}>
            <p style={{ color: '#cc0000', fontSize: '13px' }}>Error: {error}</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div style={styles.centerMessage}>
            <p style={{ color: '#999999', fontSize: '14px' }}>
              {searchTerm || stageFilter !== 'all'
                ? 'No projects match your search.'
                : "No projects yet. Be the first to share what you're building!"}
            </p>
          </div>
        ) : (
          <div style={styles.grid}>
            {filteredProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
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
    background: '#3f3b3b',
    fontFamily: 'DM Sans, sans-serif',
  },
  content: {
    maxWidth: '940px',
    margin: '0 auto',
    padding: '40px 24px',
  },
  hero: {
    marginBottom: '32px',
  },
  eyebrow: {
    fontSize: '12px',
    fontWeight: 500,
    color: '#1a7a4a',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    marginBottom: '8px',
  },
  heading: {
    fontSize: '26px',
    fontWeight: 500,
    color: '#1a7a4a',
    margin: 0,
    lineHeight: 1.3,
  },
  subheading: {
    fontSize: '13px',
    color: '#1a7a4a',
    marginTop: '6px',
  },
  filterBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: '#ffffff',
    border: '0.5px solid #e8e7e2',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '28px',
  },
  searchWrap: {
    flex: 1,
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '15px',
    height: '15px',
    color: '#aaa',
    pointerEvents: 'none',
  },
  searchInput: {
    width: '100%',
    padding: '9px 12px 9px 36px',
    border: '0.5px solid #e2e2de',
    borderRadius: '8px',
    fontSize: '13px',
    outline: 'none',
    fontFamily: 'DM Sans, sans-serif',
    color: '#0d0d0d',
    background: '#fafaf8',
    boxSizing: 'border-box',
  },
  divider: {
    width: '0.5px',
    height: '28px',
    background: '#f3f0f0',
    flexShrink: 0,
  },
  stageFilters: {
    display: 'flex',
    gap: '6px',
  },
  filterBtn: {
    padding: '6px 14px',
    border: '0.5px solid',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s',
    fontFamily: 'DM Sans, sans-serif',
    whiteSpace: 'nowrap',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
    gap: '16px',
  },
  centerMessage: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
  },
  spinner: {
    width: '28px',
    height: '28px',
    border: '2px solid #e8e7e2',
    borderTop: '2px solid #1a7a4a',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
}