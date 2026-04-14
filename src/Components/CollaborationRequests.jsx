import { useNavigate } from 'react-router-dom'
import { useCollaborationRequests } from '../hooks/useCollaborationRequests'
import { useState } from 'react'

export default function CollaborationRequests() {
  const navigate = useNavigate()
  const {
    sentRequests,
    receivedRequests,
    loading,
    error,
    respondToRequest
  } = useCollaborationRequests()

  const [responding, setResponding] = useState(null)
  const [activeTab, setActiveTab] = useState('received')

  const getStatusStyle = (status) => {
    const styles = {
      pending:  { bg: '#fff8e1', color: '#f59e0b', label: 'Pending' },
      accepted: { bg: '#e8f7ef', color: '#1a7a4a', label: 'Accepted' },
      declined: { bg: '#fff0f0', color: '#cc0000', label: 'Declined' },
    }
    return styles[status] || styles.pending
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      month: 'short', day: 'numeric'
    })
  }

  const getInitials = (username) => {
    if (!username) return '?'
    return username.split(' ')
      .map(w => w[0]).join('')
      .toUpperCase().slice(0, 2)
  }

  const handleRespond = async (requestId, status) => {
    try {
      setResponding(requestId)
      await respondToRequest(requestId, status)
    } catch (err) {
      console.error('Error responding to request:', err)
    } finally {
      setResponding(null)
    }
  }

  if (loading) return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <span style={styles.title}>Collaboration Requests</span>
      </div>
      <div style={styles.loadingRow}>
        <div style={styles.spinner} />
        <span style={{ fontSize: 12, color: '#888' }}>
          Loading requests...
        </span>
      </div>
    </div>
  )

  if (error) return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <span style={styles.title}>Collaboration Requests</span>
      </div>
      <p style={{ padding: 16, color: '#cc0000', fontSize: 13 }}>
        Error: {error}
      </p>
    </div>
  )

  const totalCount = sentRequests.length + receivedRequests.length
  const pendingCount = receivedRequests.filter(
    r => r.status === 'pending'
  ).length

  return (
    <div style={styles.wrap}>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.title}>Collaboration Requests</span>
          {/* Show red badge if there are pending received requests */}
          {pendingCount > 0 && (
            <span style={styles.pendingBadge}>
              {pendingCount} pending
            </span>
          )}
        </div>
        <span style={styles.totalCount}>
          {totalCount} total
        </span>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tab,
            borderBottom: activeTab === 'received'
              ? '2px solid #1a7a4a'
              : '2px solid transparent',
            color: activeTab === 'received' ? '#1a7a4a' : '#888',
          }}
          onClick={() => setActiveTab('received')}
        >
          Received ({receivedRequests.length})
        </button>
        <button
          style={{
            ...styles.tab,
            borderBottom: activeTab === 'sent'
              ? '2px solid #1a7a4a'
              : '2px solid transparent',
            color: activeTab === 'sent' ? '#1a7a4a' : '#888',
          }}
          onClick={() => setActiveTab('sent')}
        >
          Sent ({sentRequests.length})
        </button>
      </div>

      <div style={styles.body}>

        {/* Received requests tab */}
        {activeTab === 'received' && (
          <>
            {receivedRequests.length === 0 ? (
              <div style={styles.emptyState}>
                <p style={styles.emptyTitle}>
                  No collaboration requests yet
                </p>
                <p style={styles.emptySub}>
                  When developers raise their hand on your
                  projects, requests will appear here.
                </p>
              </div>
            ) : (
              <div style={styles.list}>
                {receivedRequests.map(request => {
                  const status = getStatusStyle(request.status)
                  const isResponding = responding === request.id

                  return (
                    <div key={request.id} style={styles.requestCard}>

                      {/* Sender info */}
                      <div style={styles.requestTop}>
                        <div style={styles.senderRow}>
                          {request.profiles?.avatar_url ? (
                            <img
                              src={request.profiles.avatar_url}
                              alt={request.profiles.username}
                              style={styles.avatar}
                            />
                          ) : (
                            <div style={styles.avatarFallback}>
                              {getInitials(request.profiles?.username)}
                            </div>
                          )}
                          <div>
                            <div style={styles.senderName}>
                              {request.profiles?.username || 'Anonymous'}
                            </div>
                            <div style={styles.requestDate}>
                              {formatDate(request.created_at)}
                            </div>
                          </div>
                        </div>

                        {/* Status badge */}
                        <div style={{
                          ...styles.statusBadge,
                          background: status.bg,
                          color: status.color
                        }}>
                          {status.label}
                        </div>
                      </div>

                      {/* Which project */}
                      <div
                        style={styles.projectLink}
                        onClick={() => navigate(
                          `/project/${request.projects?.id}`
                        )}
                      >
                        On: {request.projects?.name}
                      </div>

                      {/* Their message */}
                      <p style={styles.message}>
                        "{request.message}"
                      </p>

                      {/* Accept / Decline buttons
                          Only shown when status is pending */}
                      {request.status === 'pending' && (
                        <div style={styles.responseButtons}>
                          <button
                            style={{
                              ...styles.acceptBtn,
                              opacity: isResponding ? 0.6 : 1
                            }}
                            onClick={() => handleRespond(
                              request.id, 'accepted'
                            )}
                            disabled={isResponding}
                          >
                            {isResponding ? '...' : 'Accept'}
                          </button>
                          <button
                            style={{
                              ...styles.declineBtn,
                              opacity: isResponding ? 0.6 : 1
                            }}
                            onClick={() => handleRespond(
                              request.id, 'declined'
                            )}
                            disabled={isResponding}
                          >
                            {isResponding ? '...' : 'Decline'}
                          </button>
                        </div>
                      )}

                      {/* Accepted confirmation message */}
                      {request.status === 'accepted' && (
                        <p style={styles.acceptedNote}>
                          You accepted this request. Reach out
                          to {request.profiles?.username} to
                          get started.
                        </p>
                      )}

                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}

        {/* Sent requests tab */}
        {activeTab === 'sent' && (
          <>
            {sentRequests.length === 0 ? (
              <div style={styles.emptyState}>
                <p style={styles.emptyTitle}>
                  No requests sent yet
                </p>
                <p style={styles.emptySub}>
                  When you raise your hand on a project,
                  it will appear here.
                </p>
              </div>
            ) : (
              <div style={styles.list}>
                {sentRequests.map(request => {
                  const status = getStatusStyle(request.status)

                  return (
                    <div key={request.id} style={styles.requestCard}>

                      {/* Project info */}
                      <div style={styles.requestTop}>
                        <div
                          style={styles.projectLink}
                          onClick={() => navigate(
                            `/project/${request.projects?.id}`
                          )}
                        >
                          {request.projects?.name}
                        </div>

                        {/* Status badge */}
                        <div style={{
                          ...styles.statusBadge,
                          background: status.bg,
                          color: status.color
                        }}>
                          {status.label}
                        </div>
                      </div>

                      {/* Project owner */}
                      <div style={styles.ownerRow}>
                        <span style={styles.ownerLabel}>
                          Owner:
                        </span>
                        <div style={styles.ownerName}>
                          {request.projects?.profiles?.username
                            || 'Unknown'}
                        </div>
                      </div>

                      {/* Your message */}
                      <p style={styles.message}>
                        "{request.message}"
                      </p>

                      <div style={styles.sentDate}>
                        Sent {formatDate(request.created_at)}
                      </div>

                      {/* Status-specific feedback */}
                      {request.status === 'accepted' && (
                        <p style={styles.acceptedNote}>
                          Your request was accepted! Reach out
                          to the project owner to get started.
                        </p>
                      )}
                      {request.status === 'declined' && (
                        <p style={styles.declinedNote}>
                          This request was declined.
                        </p>
                      )}

                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  )
}
const styles = {
  wrap: {
    background: '#fff',
    border: '1px solid #e2e2de',
    borderRadius: 12,
    overflow: 'hidden',
    fontFamily: 'DM Sans, sans-serif',
  },
  header: {
    padding: '14px 18px',
    borderBottom: '1px solid #e2e2de',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: 600,
    color: '#0d0d0d',
  },
  pendingBadge: {
    fontSize: 11,
    fontWeight: 500,
    color: '#fff',
    background: '#cc0000',
    padding: '2px 8px',
    borderRadius: 20,
  },
  totalCount: {
    fontSize: 12,
    color: '#888',
  },
  tabs: {
    display: 'flex',
    borderBottom: '1px solid #e2e2de',
    padding: '0 18px',
  },
  tab: {
    padding: '10px 16px',
    background: 'transparent',
    border: 'none',
    fontSize: 13,
    cursor: 'pointer',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 500,
    transition: 'color 0.15s',
  },
  body: {
    padding: '16px 18px',
  },
  loadingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '16px 18px',
  },
  spinner: {
    width: 16, height: 16,
    border: '2px solid #e2e2de',
    borderTop: '2px solid #1a7a4a',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  emptyState: {
    padding: '24px 0',
    textAlign: 'center',
  },
  emptyTitle: {
    fontSize: 13,
    fontWeight: 500,
    color: '#0d0d0d',
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 12,
    color: '#888',
    lineHeight: 1.6,
    maxWidth: 280,
    margin: '0 auto',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  requestCard: {
    border: '1px solid #e2e2de',
    borderRadius: 10,
    padding: '14px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  requestTop: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  senderRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 32, height: 32,
    borderRadius: '50%',
    objectFit: 'cover',
    flexShrink: 0,
  },
  avatarFallback: {
    width: 32, height: 32,
    borderRadius: '50%',
    background: '#1a7a4a',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11,
    fontWeight: 600,
    flexShrink: 0,
  },
  senderName: {
    fontSize: 13,
    fontWeight: 500,
    color: '#0d0d0d',
  },
  requestDate: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
  },
  statusBadge: {
    fontSize: 11,
    fontWeight: 500,
    padding: '3px 10px',
    borderRadius: 20,
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  projectLink: {
    fontSize: 12,
    color: '#1a7a4a',
    fontWeight: 500,
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  message: {
    fontSize: 13,
    color: '#555',
    lineHeight: 1.6,
    fontStyle: 'italic',
    margin: 0,
    background: '#fafaf8',
    padding: '8px 12px',
    borderRadius: 8,
    borderLeft: '3px solid #e2e2de',
  },
  responseButtons: {
    display: 'flex',
    gap: 8,
    marginTop: 4,
  },
  acceptBtn: {
    flex: 1,
    padding: '8px',
    background: '#1a7a4a',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'DM Sans, sans-serif',
    transition: 'opacity 0.15s',
  },
  declineBtn: {
    flex: 1,
    padding: '8px',
    background: '#fff',
    color: '#cc0000',
    border: '1px solid #ffc0c0',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'DM Sans, sans-serif',
    transition: 'opacity 0.15s',
  },
  acceptedNote: {
    fontSize: 12,
    color: '#1a7a4a',
    background: '#e8f7ef',
    padding: '8px 12px',
    borderRadius: 8,
    margin: 0,
    lineHeight: 1.5,
  },
  declinedNote: {
    fontSize: 12,
    color: '#888',
    background: '#f4f4f2',
    padding: '8px 12px',
    borderRadius: 8,
    margin: 0,
  },
  ownerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  ownerLabel: {
    fontSize: 12,
    color: '#888',
  },
  ownerName: {
    fontSize: 12,
    fontWeight: 500,
    color: '#0d0d0d',
  },
  sentDate: {
    fontSize: 11,
    color: '#aaa',
  },
}
