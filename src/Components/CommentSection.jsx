import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useComments } from '../hooks/useComments'

export default function CommentSection({ projectId }) {
  const { user } = useAuth()
  const { comments, loading, postComment } = useComments(projectId)

  const [text, setText] = useState('')
  const [posting, setPosting] = useState(false)
  const [error, setError] = useState('')

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)


    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`

    return date.toLocaleDateString('en-ZA', {
      month: 'short', day: 'numeric'
    })
  }

  const getInitials = (username) => {
    if (!username) return '?'
    return username
      .split(' ')
      .map(w => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getAvatarColor = (username) => {
    const colors = [
      '#1a7a4a', '#0d0d0d', '#185FA5',
      '#854F0B', '#712B13', '#3C3489'
    ]
    if (!username) return colors[0]
    const index = username.charCodeAt(0) % colors.length
    return colors[index]
  }

  const handlePost = async () => {
    if (!text.trim()) return
    if (text.trim().length < 2) {
      setError('Comment is too short')
      return
    }

    try {
      setError('')
      setPosting(true)
      await postComment(user.id, text)
      setText('')
    } catch (err) {
      setError('Failed to post comment. Please try again.')
    } finally {
      setPosting(false)
    }
  }


  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handlePost()
    }
  }

  return (
    <div style={styles.wrap}>

      {/* Header */}
      <div style={styles.header}>
        <span style={styles.title}>
          Comments
        </span>
        <span style={styles.count}>
          {comments.length}
        </span>
      </div>

      <div style={styles.body}>

        {/* Loading state */}
        {loading ? (
          <div style={styles.loadingRow}>
            <div style={styles.spinner} />
            <span style={{ fontSize: 12, color: '#888' }}>
              Loading comments...
            </span>
          </div>
        ) : comments.length === 0 ? (

          /* Empty state */
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>
              No comments yet. Start the conversation.
            </p>
          </div>
        ) : (

          /* Comments list */
          <div style={styles.list}>
            {comments.map((comment, index) => (
              <div
                key={comment.id}
                style={{
                  ...styles.comment,
                  // No border on the last comment
                  borderBottom: index === comments.length - 1
                    ? 'none'
                    : '1px solid #f4f4f2'
                }}
              >
                {/* Avatar */}
                <div style={{
                  ...styles.avatar,
                  background: getAvatarColor(comment.profiles?.username)
                }}>
                  {comment.profiles?.avatar_url ? (
                    <img
                      src={comment.profiles.avatar_url}
                      alt={comment.profiles.username}
                      style={{
                        width: '100%', height: '100%',
                        borderRadius: '50%', objectFit: 'cover'
                      }}
                    />
                  ) : (
                    getInitials(comment.profiles?.username)
                  )}
                </div>

                {/* Comment content */}
                <div style={styles.commentContent}>
                  <div style={styles.commentMeta}>
                    <span style={styles.commentAuthor}>
                      {comment.profiles?.username || 'Anonymous'}
                    </span>
                    {/* Show "You" badge if this is the current user's comment */}
                    {comment.user_id === user?.id && (
                      <span style={styles.youBadge}>You</span>
                    )}
                    <span style={styles.commentTime}>
                      {formatDate(comment.created_at)}
                    </span>
                  </div>
                  <p style={styles.commentText}>
                    {comment.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div style={styles.errorMsg}>{error}</div>
        )}

        {/* Comment input */}
        <div style={styles.inputSection}>
          {/* Current user's avatar next to input */}
          <div style={{
            ...styles.avatar,
            background: getAvatarColor(user?.email),
            flexShrink: 0,
          }}>
            {user?.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt="You"
                style={{
                  width: '100%', height: '100%',
                  borderRadius: '50%', objectFit: 'cover'
                }}
              />
            ) : (
              (user?.email || '?').slice(0, 2).toUpperCase()
            )}
          </div>

          <div style={styles.inputWrap}>
            <textarea
              style={styles.input}
              placeholder="Write a comment... (Enter to post, Shift+Enter for new line)"
              value={text}
              onChange={e => {
                setText(e.target.value)
                if (error) setError('')
              }}
              onKeyDown={handleKeyDown}
              rows={1}
              // Auto-grow the textarea as user types
              onInput={e => {
                e.target.style.height = 'auto'
                e.target.style.height = e.target.scrollHeight + 'px'
              }}
            />
            <button
              style={{
                ...styles.postBtn,
                opacity: (posting || !text.trim()) ? 0.5 : 1,
                cursor: (posting || !text.trim()) ? 'not-allowed' : 'pointer'
              }}
              onClick={handlePost}
              disabled={posting || !text.trim()}
            >
              {posting ? '...' : 'Post'}
            </button>
          </div>
        </div>

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
  },
  header: {
    padding: '14px 18px',
    borderBottom: '1px solid #e2e2de',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: 600,
    color: '#0d0d0d',
  },
  count: {
    fontSize: 11,
    fontWeight: 500,
    color: '#888',
    background: '#f4f4f2',
    padding: '2px 7px',
    borderRadius: 20,
  },
  body: {
    padding: '16px 18px',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  loadingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '8px 0',
  },
  spinner: {
    width: 16, height: 16,
    border: '2px solid #e2e2de',
    borderTop: '2px solid #1a7a4a',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  emptyState: {
    padding: '16px 0',
  },
  emptyText: {
    fontSize: 13,
    color: '#888',
    margin: 0,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
  },
  comment: {
    display: 'flex',
    gap: 12,
    paddingBottom: 14,
    marginBottom: 14,
  },
  avatar: {
    width: 32, height: 32,
    borderRadius: '50%',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11,
    fontWeight: 600,
    flexShrink: 0,
    overflow: 'hidden',
    fontFamily: 'DM Sans, sans-serif',
  },
  commentContent: {
    flex: 1,
    minWidth: 0,
  },
  commentMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  commentAuthor: {
    fontSize: 12,
    fontWeight: 600,
    color: '#0d0d0d',
  },
  youBadge: {
    fontSize: 10,
    color: '#1a7a4a',
    background: '#e8f7ef',
    padding: '1px 6px',
    borderRadius: 20,
    fontWeight: 500,
  },
  commentTime: {
    fontSize: 11,
    color: '#aaa',
  },
  commentText: {
    fontSize: 13,
    color: '#333',
    lineHeight: 1.6,
    margin: 0,
    // Preserve line breaks from Shift+Enter
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  errorMsg: {
    fontSize: 12,
    color: '#cc0000',
    background: '#fff0f0',
    border: '1px solid #ffc0c0',
    padding: '8px 12px',
    borderRadius: 8,
  },
  inputSection: {
    display: 'flex',
    gap: 10,
    alignItems: 'flex-end',
    paddingTop: 4,
    borderTop: '1px solid #f4f4f2',
  },
  inputWrap: {
    flex: 1,
    display: 'flex',
    gap: 8,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    border: '1px solid #e2e2de',
    borderRadius: 10,
    padding: '9px 13px',
    fontSize: 13,
    fontFamily: 'DM Sans, sans-serif',
    color: '#ffffff',
    resize: 'none',
    outline: 'none',
    lineHeight: 1.5,
    minHeight: 40,
    maxHeight: 120,
    overflowY: 'auto',
    transition: 'border-color 0.15s',
  },
  postBtn: {
    padding: '9px 16px',
    background: '#1a7a4a',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 500,
    fontFamily: 'DM Sans, sans-serif',
    flexShrink: 0,
    transition: 'opacity 0.15s',
  },
}