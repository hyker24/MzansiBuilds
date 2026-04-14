import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'
import { validateProject } from '../utils/Validation'
import Navbar from '../Components/NavBar'

export default function EditProject() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [name, setname] = useState('')
  const [description, setDescription] = useState('')
  const [stage, setStage] = useState('')
  const [supportNeeded, setSupportNeeded] = useState('')
  const [repoUrl, setRepoUrl] = useState('')

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [serverError, setServerError] = useState('')

  useEffect(() => {
    fetchProject()
  }, [id])

  async function fetchProject() {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      if (data.user_id !== user.id) {
        navigate('/feed')
        return
      }

      setname(data.name)
      setDescription(data.description || '')
      setStage(data.stage)
      setSupportNeeded(data.support_needed || '')
      setRepoUrl(data.repo_url || '')
    } catch (err) {
      setServerError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')

    const validationErrors = validateProject({ name, description, stage })
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setErrors({})

    try {
      setSaving(true)

      const { error } = await supabase
        .from('projects')
        .update({
          name: name.trim(),
          description: description.trim(),
          stage,
          support_needed: supportNeeded.trim() || null,
          repo_url: repoUrl.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (error) throw error

      navigate(`/project/${id}`)
    } catch (err) {
      setServerError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const fieldError = (field) => {
    if (!errors[field]) return null
    return <span style={styles.fieldError}>{errors[field]}</span>
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

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.content}>
        <div style={styles.header}>
          <button
            style={styles.backBtn}
            onClick={() => navigate(`/project/${id}`)}
          >
            ← Back to project
          </button>
          <h1 style={styles.heading}>Edit project</h1>
          <p style={styles.subheading}>Update your project details</p>
        </div>

        {serverError && (
          <div style={styles.serverError}>{serverError}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.cardTitle}>Project details</span>
            </div>
            <div style={styles.cardBody}>

              <div style={styles.field}>
                <label style={styles.label}>
                  Project name <span style={styles.required}>*</span>
                </label>
                <input
                  style={{
                    ...styles.input,
                    borderColor: errors.name ? '#cc0000' : '#e2e2de'
                  }}
                  type="text"
                  value={name}
                  onChange={e => {
                    setname(e.target.value)
                    if (errors.name) setErrors(p => ({ ...p, name: undefined }))
                  }}
                  maxLength={100}
                />
                <div style={styles.fieldBottom}>
                  {fieldError('name')}
                  <span style={styles.charCount}>{name.length}/100</span>
                </div>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>
                  Description <span style={styles.required}>*</span>
                </label>
                <textarea
                  style={{
                    ...styles.textarea,
                    borderColor: errors.description ? '#cc0000' : '#e2e2de'
                  }}
                  value={description}
                  onChange={e => {
                    setDescription(e.target.value)
                    if (errors.description) setErrors(p => ({ ...p, description: undefined }))
                  }}
                  rows={4}
                  maxLength={500}
                />
                <div style={styles.fieldBottom}>
                  {fieldError('description')}
                  <span style={styles.charCount}>{description.length}/500</span>
                </div>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>
                  Stage <span style={styles.required}>*</span>
                </label>
                <select
                  style={{
                    ...styles.select,
                    borderColor: errors.stage ? '#cc0000' : '#e2e2de',
                    color: '#0d0d0d'
                  }}
                  value={stage}
                  onChange={e => {
                    setStage(e.target.value)
                    if (errors.stage) setErrors(p => ({ ...p, stage: undefined }))
                  }}
                >
                  <option value="" disabled>Select a stage</option>
                  <option value="idea">Idea</option>
                  <option value="in progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                {fieldError('stage')}
              </div>

            </div>
          </div>

          <div style={{ ...styles.card, marginTop: 16 }}>
            <div style={styles.cardHeader}>
              <span style={styles.cardTitle}>Optional details</span>
              <span style={styles.optionalBadge}>Optional</span>
            </div>
            <div style={styles.cardBody}>

              <div style={styles.field}>
                <label style={styles.label}>Support needed</label>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="e.g. Frontend developer, UI designer"
                  value={supportNeeded}
                  onChange={e => setSupportNeeded(e.target.value)}
                  maxLength={100}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Repository URL</label>
                <input
                  style={styles.input}
                  type="url"
                  placeholder="https://github.com/username/project"
                  value={repoUrl}
                  onChange={e => setRepoUrl(e.target.value)}
                />
              </div>

            </div>
          </div>

          <div style={styles.actions}>
            <button
              type="button"
              style={styles.cancelBtn}
              onClick={() => navigate(`/project/${id}`)}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                ...styles.submitBtn,
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
  page: { minHeight: '100vh', background: '#111', fontFamily: 'DM Sans, sans-serif' },
  center: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px' },
  spinner: { width: 32, height: 32, border: '3px solid #e2e2de', borderTop: '3px solid #1a7a4a', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  content: { maxWidth: 640, margin: '0 auto', padding: '32px 24px' },
  header: { marginBottom: 24 },
  backBtn: { background: 'transparent', border: '1px solid #e2e2de', color: '#888', padding: '6px 14px', borderRadius: 8, fontSize: 12, cursor: 'pointer', marginBottom: 16, fontFamily: 'DM Sans, sans-serif' },
  heading: { fontSize: 24, fontWeight: 700, color: '#0d0d0d', margin: 0 },
  subheading: { fontSize: 13, color: '#888', marginTop: 4 },
  serverError: { background: '#fff0f0', border: '1px solid #ffc0c0', color: '#cc0000', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 },
  card: { background: '#fff', border: '1px solid #e2e2de', borderRadius: 12, overflow: 'hidden' },
  cardHeader: { padding: '14px 18px', borderBottom: '1px solid #e2e2de', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  cardTitle: { fontSize: 13, fontWeight: 600, color: '#0d0d0d' },
  optionalBadge: { fontSize: 11, color: '#888', background: '#f4f4f2', padding: '2px 8px', borderRadius: 20 },
  cardBody: { padding: '20px 18px' },
  field: { marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 13, fontWeight: 500, color: '#0d0d0d' },
  required: { color: '#cc0000', marginLeft: 2 },
  input: { padding: '10px 14px', border: '1px solid', borderRadius: 10, fontSize: 14, fontFamily: 'DM Sans, sans-serif', color: '#0d0d0d', outline: 'none' },
  textarea: { padding: '10px 14px', border: '1px solid', borderRadius: 10, fontSize: 14, fontFamily: 'DM Sans, sans-serif', color: '#0d0d0d', outline: 'none', resize: 'vertical', lineHeight: 1.6 },
  select: { padding: '10px 14px', border: '1px solid', borderRadius: 10, fontSize: 14, fontFamily: 'DM Sans, sans-serif', outline: 'none', background: '#fff', cursor: 'pointer', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', paddingRight: 36 },
  fieldBottom: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  fieldError: { fontSize: 12, color: '#cc0000' },
  charCount: { fontSize: 11, color: '#aaa', marginLeft: 'auto' },
  hint: { fontSize: 12, color: '#aaa' },
  actions: { display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' },
  cancelBtn: { padding: '10px 20px', background: '#fff', border: '1px solid #e2e2de', borderRadius: 10, fontSize: 13, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', color: '#555' },
  submitBtn: { padding: '10px 24px', background: '#1a7a4a', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' },
}