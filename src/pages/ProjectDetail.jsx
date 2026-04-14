import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'
import { useProject } from '../hooks/useProject'
import { useComments } from '../hooks/useComments'
import { useMilestones } from '../hooks/useMilestones'
import { useCollaboration } from '../hooks/useCollaboration'
import Navbar from '../Components/NavBar'
import CommentSection from '../Components/CommentSection'

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const { project, loading, error, refetch } = useProject(id)
  const { comments, postComment } = useComments(id)
  const { milestones, addMilestone } = useMilestones(id)
  const { hasRequested, sendRequest } = useCollaboration(id)

  const [commentText, setCommentText] = useState('')
  const [commentLoading, setCommentLoading] = useState(false)

  const [showCollabModal, setShowCollabModal] = useState(false)
  const [collabMessage, setCollabMessage] = useState('')
  const [collabLoading, setCollabLoading] = useState(false)

  const [showMilestoneModal, setShowMilestoneModal] = useState(false)
  const [milestoneTitle, setMilestoneTitle] = useState('')
  const [milestoneDesc, setMilestoneDesc] = useState('')
  const [milestoneLoading, setMilestoneLoading] = useState(false)

  const [completing, setCompleting] = useState(false)

  const isOwner = user?.id === project?.user_id

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

  const getStageStyle = (stage) => {
    const stages = {
      'idea':        { label: 'Idea',        bg: '#fff8e1', color: '#f59e0b' },
      'in progress': { label: 'In Progress', bg: '#e8f7ef', color: '#1a7a4a' },
      'completed':   { label: 'Completed',   bg: '#f0fdf4', color: '#16a34a' },
    }
    return stages[stage] || { label: stage, bg: '#f4f4f2', color: '#888' }
  }

  const handleComment = async () => {
    if (!commentText.trim()) return
    try {
      setCommentLoading(true)
      await postComment(user.id, commentText)
      setCommentText('') 
    } catch (err) {
      console.error('Error posting comment:', err)
    } finally {
      setCommentLoading(false)
    }
  }

  const handleCollab = async () => {
    if (!collabMessage.trim()) return
    try {
      setCollabLoading(true)
      await sendRequest(collabMessage)
      setCollabMessage('')
      setShowCollabModal(false)
    } catch (err) {
      console.error('Error sending collab request:', err)
    } finally {
      setCollabLoading(false)
    }
  }

  const handleMilestone = async () => {
    if (!milestoneTitle.trim()) return
    try {
      setMilestoneLoading(true)
      await addMilestone(milestoneTitle, milestoneDesc)
      setMilestoneTitle('')
      setMilestoneDesc('')
      setShowMilestoneModal(false)
    } catch (err) {
      console.error('Error adding milestone:', err)
    } finally {
      setMilestoneLoading(false)
    }
  }

  const handleComplete = async () => {
    if (!window.confirm(
      'Mark this project as complete? It will be added to the Celebration Wall.'
    )) return

    try {
      setCompleting(true)
      const { error } = await supabase
        .from('projects')
        .update({ is_completed: true, stage: 'completed' })
        .eq('id', id)

      if (error) throw error
      refetch()
    } catch (err) {
      console.error('Error completing project:', err)
    } finally {
      setCompleting(false)
    }
  }

  if (loading) return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.center}>
        <div style={styles.spinner} />
        <p style={{ color: '#888', marginTop: 16 }}>Loading project...</p>
      </div>
    </div>
  )

  // Error state
  if (error) return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.center}>
        <p style={{ color: '#cc0000' }}>Error: {error}</p>
        <button style={styles.backBtn} onClick={() => navigate('/feed')}>
          Back to feed
        </button>
      </div>
    </div>
  )

  // Project not found
  if (!project) return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.center}>
        <p style={{ color: '#888' }}>Project not found.</p>
        <button style={styles.backBtn} onClick={() => navigate('/feed')}>
          Back to feed
        </button>
      </div>
    </div>
  )

  const stage = getStageStyle(project.stage)

  return (
    <div style={styles.page}>
      <Navbar />

      {/* Hero section — black background with project info */}
      <div style={styles.hero}>
        <button
          style={styles.backBtn}
          onClick={() => navigate('/feed')}
        >
          ← Back to feed
        </button>

        {/* Stage badge */}
        <div style={{ ...styles.stagePill, background: stage.bg, color: stage.color }}>
          <div style={{ ...styles.stageDot, background: stage.color }} />
          {stage.label}
        </div>

        <h1 style={styles.heroTitle}>{project.name}</h1>
        <p style={styles.heroDesc}>{project.description}</p>

        {/* Author info */}
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
            <div style={styles.authorDate}>
              Posted {formatDate(project.created_at)}
            </div>
          </div>
        </div>

        {/* Repo link if available */}
        {project.repo_url && (
          <a
            href={project.repo_url}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.repoLink}
          >
            View repository →
          </a>
        )}
      </div>

      {/* Body */}
      <div style={styles.body}>

        {/* Support needed */}
        {project.support_needed && (
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.cardTitle}>Support needed</span>
            </div>
            <div style={styles.cardBody}>
              <span style={styles.supportTag}>
                {project.support_needed}
              </span>
            </div>
          </div>
        )}

        {/* Milestones */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.cardTitle}>
              Milestones ({milestones.length})
            </span>
            {/* Only project owner can add milestones */}
            {isOwner && !project.is_completed && (
              <button
                style={styles.smallBtn}
                onClick={() => setShowMilestoneModal(true)}
              >
                + Add milestone
              </button>
            )}
          </div>
          <div style={styles.cardBody}>
            {milestones.length === 0 ? (
              <p style={styles.emptyText}>No milestones yet.</p>
            ) : (
              milestones.map(milestone => (
                <div key={milestone.id} style={styles.milestone}>
                  <div style={styles.msDot} />
                  <div>
                    <div style={styles.msTitle}>{milestone.title}</div>
                    {milestone.description && (
                      <div style={styles.msDesc}>{milestone.description}</div>
                    )}
                    <div style={styles.msDate}>
                      {formatDate(milestone.achieved_at)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Action buttons */}
        {/* Only show collab button if user is NOT the owner */}
        {!isOwner && (
          <div style={styles.actionRow}>
            <button
              style={{
                ...styles.collabBtn,
                ...(hasRequested ? styles.collabBtnSent : {})
              }}
              onClick={() => !hasRequested && setShowCollabModal(true)}
              disabled={hasRequested}
            >
              {hasRequested
                ? 'Collab request sent'
                : 'Raise hand to collaborate'
              }
            </button>
          </div>
        )}

        {/* Mark as complete — only owner sees this */}
        {isOwner && (
            <button
                style={styles.editProjectBtn}
                onClick={() => navigate(`/project/${id}/edit`)}
            >
                Edit project
            </button>
            )}
        {isOwner && !project.is_completed && (
          <button
            style={styles.completeBtn}
            onClick={handleComplete}
            disabled={completing}
          >
            {completing ? 'Marking complete...' : 'Mark project as complete'}
          </button>
        )}
                    

        {/* Completed banner */}
        {project.is_completed && (
          <div style={styles.completedBanner}>
            This project is complete and featured on the Celebration Wall
          </div>
        )}

        {/* Comments */}
        <CommentSection projectId={id}/>

      </div>

      {/* Collaboration modal */}
      {showCollabModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <h3 style={styles.modalTitle}>Raise your hand</h3>
            <p style={styles.modalSub}>
              Tell the developer why you want to collaborate
              and what you bring to the table.
            </p>
            <textarea
              style={styles.modalInput}
              placeholder="I'd love to help with..."
              value={collabMessage}
              onChange={e => setCollabMessage(e.target.value)}
              rows={4}
            />
            <div style={styles.modalActions}>
              <button
                style={styles.modalCancel}
                onClick={() => {
                  setShowCollabModal(false)
                  setCollabMessage('')
                }}
              >
                Cancel
              </button>
              <button
                style={{
                  ...styles.modalSend,
                  opacity: collabLoading ? 0.7 : 1
                }}
                onClick={handleCollab}
                disabled={collabLoading || !collabMessage.trim()}
              >
                {collabLoading ? 'Sending...' : 'Send request'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add milestone modal */}
      {showMilestoneModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <h3 style={styles.modalTitle}>Add milestone</h3>
            <p style={styles.modalSub}>
              Record a milestone you have achieved on this project.
            </p>
            <input
              style={{ ...styles.modalInput, minHeight: 'auto', marginBottom: 10 }}
              placeholder="Milestone title e.g. Database schema complete"
              value={milestoneTitle}
              onChange={e => setMilestoneTitle(e.target.value)}
            />
            <textarea
              style={styles.modalInput}
              placeholder="Description (optional)"
              value={milestoneDesc}
              onChange={e => setMilestoneDesc(e.target.value)}
              rows={3}
            />
            <div style={styles.modalActions}>
              <button
                style={styles.modalCancel}
                onClick={() => {
                  setShowMilestoneModal(false)
                  setMilestoneTitle('')
                  setMilestoneDesc('')
                }}
              >
                Cancel
              </button>
              <button
                style={{
                  ...styles.modalSend,
                  opacity: milestoneLoading ? 0.7 : 1
                }}
                onClick={handleMilestone}
                disabled={milestoneLoading || !milestoneTitle.trim()}
              >
                {milestoneLoading ? 'Saving...' : 'Save milestone'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#3f3b3b',
    fontFamily: '"DM Sans", sans-serif',
  },

  // ── Loading / error centred layout ──────────────────────────────
  center: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
    gap: 12,
  },
  spinner: {
    width: 28,
    height: 28,
    border: '2.5px solid #2a2a2a',
    borderTop: '2.5px solid #1a7a4a',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },

  // ── Hero ─────────────────────────────────────────────────────────
  // Dark charcoal with a very subtle green tint — no harsh flat green
  hero: {
    background: 'linear-gradient(160deg, #0f1a13 0%, #111 60%, #0a0a0a 100%)',
    borderBottom: '1px solid #1e2e22',
    padding: '36px 32px 40px',
  },
  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    background: 'transparent',
    border: '1px solid #2a2a2a',
    color: '#666',
    padding: '6px 14px',
    borderRadius: 8,
    fontSize: 12,
    cursor: 'pointer',
    marginBottom: 24,
    fontFamily: '"DM Sans", sans-serif',
    transition: 'border-color 0.15s, color 0.15s',
  },
  editProjectBtn: {
  width: '100%',
  padding: '12px',
  background: '#111111',
  color: '#fffefe',
  border: '1px solid #e2e2de',
  borderRadius: 10,
  fontSize: 13,
  fontWeight: 500,
  cursor: 'pointer',
  fontFamily: 'DM Sans, sans-serif',
  marginBottom: 8,
},
  stagePill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '4px 12px',
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.03em',
    marginBottom: 16,
    border: '1px solid transparent',
  },
  stageDot: {
    width: 5,
    height: 5,
    borderRadius: '50%',
    flexShrink: 0,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: 700,
    color: '#f0f0ee',
    lineHeight: 1.2,
    marginBottom: 12,
    letterSpacing: '-0.02em',
  },
  heroDesc: {
    fontSize: 14,
    color: '#7a7a78',
    lineHeight: 1.75,
    maxWidth: 580,
    marginBottom: 24,
  },
  authorRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 18,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    objectFit: 'cover',
    border: '1.5px solid #2a2a2a',
  },
  avatarFallback: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: '#143d20',
    border: '1.5px solid #1a7a4a33',
    color: '#4caf78',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11,
    fontWeight: 700,
    flexShrink: 0,
  },
  authorName: {
    fontSize: 13,
    fontWeight: 600,
    color: '#e0e0de',
  },
  authorDate: {
    fontSize: 11,
    color: '#555',
    marginTop: 2,
  },
  repoLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 12,
    color: '#4caf78',
    textDecoration: 'none',
    fontWeight: 500,
    padding: '5px 12px',
    background: '#0f2018',
    border: '1px solid #1a7a4a44',
    borderRadius: 8,
    marginTop: 2,
  },

  // ── Body ─────────────────────────────────────────────────────────
  body: {
    maxWidth: 760,
    margin: '0 auto',
    padding: '28px 24px 60px',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },

  // ── Cards ─────────────────────────────────────────────────────────
  card: {
    background: '#141414',
    border: '1px solid #222',
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardHeader: {
    padding: '13px 18px',
    borderBottom: '1px solid #1e1e1e',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#111',
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: 600,
    color: '#aaa',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  },
  cardBody: {
    padding: '16px 18px',
  },

  // ── Support tag ───────────────────────────────────────────────────
  supportTag: {
    display: 'inline-block',
    background: '#0f2018',
    color: '#4caf78',
    fontSize: 12,
    fontWeight: 500,
    padding: '6px 14px',
    borderRadius: 8,
    border: '1px solid #1a7a4a44',
  },

  // ── Buttons ───────────────────────────────────────────────────────
  smallBtn: {
    padding: '5px 12px',
    background: '#1a7a4a',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    fontSize: 11,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: '"DM Sans", sans-serif',
    letterSpacing: '0.02em',
  },

  // ── Milestones ────────────────────────────────────────────────────
  milestone: {
    display: 'flex',
    gap: 12,
    paddingBottom: 14,
    marginBottom: 14,
    borderBottom: '1px solid #1c1c1c',
  },
  msDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#1a7a4a',
    marginTop: 5,
    flexShrink: 0,
    boxShadow: '0 0 0 3px #1a7a4a22',
  },
  msTitle: {
    fontSize: 13,
    fontWeight: 500,
    color: '#e0e0de',
  },
  msDesc: {
    fontSize: 12,
    color: '#666',
    marginTop: 3,
    lineHeight: 1.5,
  },
  msDate: {
    fontSize: 11,
    color: '#444',
    marginTop: 5,
  },
  emptyText: {
    fontSize: 13,
    color: '#555',
  },

  // ── Action row ────────────────────────────────────────────────────
  actionRow: {
    display: 'flex',
    gap: 10,
  },
  collabBtn: {
    flex: 1,
    padding: '12px 16px',
    background: '#1a7a4a',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: '"DM Sans", sans-serif',
  },
  collabBtnSent: {
    background: '#1a1a1a',
    color: '#555',
    border: '1px solid #222',
    cursor: 'default',
  },
  completeBtn: {
    width: '100%',
    padding: '12px',
    background: '#f0f0ee',
    color: '#0a0a0a',
    border: 'none',
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: '"DM Sans", sans-serif',
    letterSpacing: '0.01em',
  },
  completedBanner: {
    background: '#0c1f14',
    border: '1px solid #1a7a4a55',
    color: '#4caf78',
    padding: '13px 18px',
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 500,
    textAlign: 'center',
    letterSpacing: '0.01em',
  },

  // ── Comments ──────────────────────────────────────────────────────
  comment: {
    display: 'flex',
    gap: 10,
    marginBottom: 14,
  },
  commentAvatar: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    background: '#1e1e1e',
    border: '1px solid #2a2a2a',
    color: '#aaa',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 9,
    fontWeight: 700,
    flexShrink: 0,
    overflow: 'hidden',
  },
  commentBubble: {
    background: '#181818',
    border: '1px solid #222',
    borderRadius: '2px 10px 10px 10px',
    padding: '9px 13px',
    flex: 1,
  },
  commentName: {
    fontSize: 11,
    fontWeight: 600,
    color: '#ccc',
    marginBottom: 4,
  },
  commentText: {
    fontSize: 13,
    color: '#999',
    lineHeight: 1.55,
  },
  commentTime: {
    fontSize: 10,
    color: '#444',
    marginTop: 5,
  },
  commentInputRow: {
    display: 'flex',
    gap: 8,
    alignItems: 'flex-end',
    marginTop: 4,
  },
  commentInput: {
    flex: 1,
    border: '1px solid #222',
    background: '#111',
    borderRadius: 10,
    padding: '10px 14px',
    fontSize: 13,
    fontFamily: '"DM Sans", sans-serif',
    color: '#e0e0de',
    resize: 'none',
    outline: 'none',
  },
  sendBtn: {
    padding: '10px 18px',
    background: '#1a7a4a',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: '"DM Sans", sans-serif',
  },

  // ── Modals ────────────────────────────────────────────────────────
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.75)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
  },
  modalBox: {
    background: '#141414',
    border: '1px solid #252525',
    borderRadius: 14,
    padding: 26,
    width: '90%',
    maxWidth: 400,
    boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: '#f0f0ee',
    marginBottom: 6,
    letterSpacing: '-0.01em',
  },
  modalSub: {
    fontSize: 13,
    color: '#666',
    marginBottom: 16,
    lineHeight: 1.55,
  },
  modalInput: {
    width: '100%',
    border: '1px solid #252525',
    background: '#0f0f0f',
    borderRadius: 8,
    padding: '10px 13px',
    fontSize: 13,
    fontFamily: '"DM Sans", sans-serif',
    color: '#e0e0de',
    outline: 'none',
    resize: 'none',
    boxSizing: 'border-box',
  },
  modalActions: {
    display: 'flex',
    gap: 8,
    marginTop: 16,
  },
  modalCancel: {
    flex: 1,
    padding: '10px',
    borderRadius: 8,
    border: '1px solid #2a2a2a',
    background: 'transparent',
    color: '#777',
    fontSize: 13,
    cursor: 'pointer',
    fontFamily: '"DM Sans", sans-serif',
  },
  modalSend: {
    flex: 1,
    padding: '10px',
    borderRadius: 8,
    border: 'none',
    background: '#1a7a4a',
    color: '#fff',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: '"DM Sans", sans-serif',
  },
}