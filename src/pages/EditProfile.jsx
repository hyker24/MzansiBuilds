import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfile } from '../hooks/useProfile'
import { useAuth } from '../context/AuthContext'
import Navbar from '../Components/NavBar'

export default function EditProfile() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { profile, loading, updateProfile, uploadAvatar } = useProfile()

  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')

  const [previewUrl, setPreviewUrl] = useState(null)
  const [avatarFile, setAvatarFile] = useState(null)

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const fileInputRef = useRef(null)

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || '')
      setBio(profile.bio || '')
    }
  }, [profile])

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Store the file for uploading later
    setAvatarFile(file)

    const localUrl = URL.createObjectURL(file)
    setPreviewUrl(localUrl)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')


    if (!username.trim()) {
      return setError('Username is required')
    }
    if (username.trim().length < 3) {
      return setError('Username must be at least 3 characters')
    }

    try {
      setSaving(true)

      const updates = {
        username: username.trim(),
        bio: bio.trim() || null,
      }

      if (avatarFile) {
        const avatarUrl = await uploadAvatar(avatarFile)
        updates.avatar_url = avatarUrl
      }

      await updateProfile(updates)

      setSuccess('Profile updated successfully')

      setAvatarFile(null)
      setPreviewUrl(null)

      setTimeout(() => navigate('/profile'), 1500)

    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const getInitials = (name) => {
    if (!name) return '?'
    return name.split(' ')
      .map(w => w[0]).join('')
      .toUpperCase().slice(0, 2)
  }

  const currentAvatar = previewUrl || profile?.avatar_url

  if (loading) return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.center}>
        <div style={styles.spinner} />
        <p style={{ color: '#888', marginTop: 16 }}>Loading profile...</p>
      </div>
    </div>
  )

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.content}>

        {/* Page header */}
        <div style={styles.header}>
          <button
            style={styles.backBtn}
            onClick={() => navigate('/profile')}
          >
            ← Back to profile
          </button>
          <h1 style={styles.heading}>Edit profile</h1>
          <p style={styles.subheading}>
            Update your public profile information
          </p>
        </div>

        {/* Feedback messages */}
        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.successMsg}>{success}</div>}

        <form onSubmit={handleSave}>

          {/* Avatar section */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.cardTitle}>Profile picture</span>
            </div>
            <div style={styles.cardBody}>
              <div style={styles.avatarSection}>

                {/* Avatar display — clicking opens file picker */}
                <div
                  style={styles.avatarWrap}
                  onClick={() => fileInputRef.current.click()}
                  title="Click to change avatar"
                >
                  {currentAvatar ? (
                    <img
                      src={currentAvatar}
                      alt="Avatar"
                      style={styles.avatarImg}
                    />
                  ) : (
                    <div style={styles.avatarFallback}>
                      {getInitials(username)}
                    </div>
                  )}
                  {/* Overlay that appears on hover */}
                  <div style={styles.avatarOverlay}>
                    <span style={{ fontSize: 11, color: '#fff' }}>
                      Change
                    </span>
                  </div>
                </div>

                <div style={styles.avatarInfo}>
                  <p style={styles.avatarHint}>
                    Click your avatar to upload a new photo
                  </p>
                  <p style={styles.avatarHint}>
                    JPG, PNG or GIF · Max 4MB
                  </p>
                  {avatarFile && (
                    <p style={{ fontSize: 12, color: '#1a7a4a', marginTop: 6 }}>
                      {avatarFile.name} selected
                    </p>
                  )}
                </div>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          {/* Profile info */}
          <div style={{ ...styles.card, marginTop: 16 }}>
            <div style={styles.cardHeader}>
              <span style={styles.cardTitle}>Profile information</span>
            </div>
            <div style={styles.cardBody}>

              {/* Username */}
              <div style={styles.field}>
                <label style={styles.label}>
                  Username
                  <span style={styles.required}>*</span>
                </label>
                <input
                  style={styles.input}
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Your username"
                  maxLength={30}
                />
                {/* Character counter */}
                <span style={styles.charCount}>
                  {username.length}/30
                </span>
              </div>

              {/* Email — read only, can't be changed here */}
              <div style={styles.field}>
                <label style={styles.label}>Email</label>
                <input
                  style={{ ...styles.input, ...styles.inputReadOnly }}
                  type="email"
                  value={user?.email || ''}
                  disabled
                />
                <span style={styles.hint}>
                  Email cannot be changed here
                </span>
              </div>

              {/* Bio */}
              <div style={styles.field}>
                <label style={styles.label}>Bio</label>
                <textarea
                  style={styles.textarea}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Tell other developers about yourself..."
                  rows={4}
                  maxLength={200}
                />
                <span style={styles.charCount}>
                  {bio.length}/200
                </span>
              </div>

            </div>
          </div>

          {/* Save button */}
          <div style={styles.actions}>
            <button
              type="button"
              style={styles.cancelBtn}
              onClick={() => navigate('/profile')}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                ...styles.saveBtn,
                opacity: saving ? 0.7 : 1
              }}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>

        </form>
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
  content: {
    maxWidth: 600,
    margin: '0 auto',
    padding: '32px 24px',
  },
  header: {
    marginBottom: 24,
  },
  backBtn: {
    background: 'transparent',
    border: '1px solid #e2e2de',
    color: '#888',
    padding: '6px 14px',
    borderRadius: 8,
    fontSize: 12,
    cursor: 'pointer',
    marginBottom: 16,
    fontFamily: 'DM Sans, sans-serif',
  },
  heading: {
    fontSize: 24,
    fontWeight: 700,
    color: '#0d0d0d',
    margin: 0,
  },
  subheading: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
  },
  error: {
    background: '#fff0f0',
    border: '1px solid #ffc0c0',
    color: '#cc0000',
    padding: '10px 14px',
    borderRadius: 8,
    fontSize: 13,
    marginBottom: 16,
  },
  successMsg: {
    background: '#e8f7ef',
    border: '1px solid #b8e8cf',
    color: '#1a7a4a',
    padding: '10px 14px',
    borderRadius: 8,
    fontSize: 13,
    marginBottom: 16,
  },
  card: {
    background: '#fff',
    border: '1px solid #e2e2de',
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardHeader: {
    padding: '14px 18px',
    borderBottom: '1px solid #e2e2de',
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: '#0d0d0d',
  },
  cardBody: {
    padding: '20px 18px',
  },
  avatarSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 20,
  },
  avatarWrap: {
    position: 'relative',
    width: 80, height: 80,
    borderRadius: '50%',
    cursor: 'pointer',
    flexShrink: 0,
    overflow: 'hidden',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '50%',
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    background: '#1a7a4a',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 22,
    fontWeight: 700,
  },
  avatarOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.45)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.15s',
    // We handle hover in JS since inline styles
    // don't support :hover pseudo class
  },
  avatarInfo: {
    flex: 1,
  },
  avatarHint: {
    fontSize: 12,
    color: '#888',
    lineHeight: 1.6,
  },
  field: {
    marginBottom: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: 500,
    color: '#0d0d0d',
  },
  required: {
    color: '#cc0000',
    marginLeft: 3,
  },
  input: {
    padding: '10px 14px',
    border: '1px solid #e2e2de',
    borderRadius: 10,
    fontSize: 14,
    fontFamily: 'DM Sans, sans-serif',
    color: '#f3f0f0',
    outline: 'none',
    transition: 'border-color 0.15s',
  },
  inputReadOnly: {
    background: '#f4f4f2',
    color: '#888',
    cursor: 'not-allowed',
  },
  textarea: {
    padding: '10px 14px',
    border: '1px solid #e2e2de',
    borderRadius: 10,
    fontSize: 14,
    fontFamily: 'DM Sans, sans-serif',
    color: '#f7f7f7',
    outline: 'none',
    resize: 'vertical',
    lineHeight: 1.6,
  },
  charCount: {
    fontSize: 11,
    color: '#aaa',
    textAlign: 'right',
  },
  hint: {
    fontSize: 11,
    color: '#aaa',
  },
  actions: {
    display: 'flex',
    gap: 10,
    marginTop: 20,
    justifyContent: 'flex-end',
  },
  cancelBtn: {
    padding: '10px 20px',
    background: '#fff',
    border: '1px solid #e2e2de',
    borderRadius: 10,
    fontSize: 13,
    cursor: 'pointer',
    fontFamily: 'DM Sans, sans-serif',
    color: '#555',
  },
  saveBtn: {
    padding: '10px 24px',
    background: '#1a7a4a',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'DM Sans, sans-serif',
  },
}