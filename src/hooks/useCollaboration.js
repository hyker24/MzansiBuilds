import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'

export function useCollaboration(projectId) {
  const { user } = useAuth()

  const [hasRequested, setHasRequested] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!projectId || !user) return
    checkExistingRequest()
  }, [projectId, user])

  async function checkExistingRequest() {
    try {
      const { data, error } = await supabase
        .from('collaboration_requests')
        .select('id')
        .eq('project_id', projectId)
        .eq('sender_id', user.id)
        .maybeSingle()

      if (error) throw error
      setHasRequested(!!data)
    } catch (err) {
      console.error('Error checking collab request:', err)
    } finally {
      setLoading(false)
    }
  }

  async function sendRequest(message) {
    if (!message.trim()) return

    const { error } = await supabase
      .from('collaboration_requests')
      .insert({
        project_id: projectId,
        sender_id: user.id,
        message: message.trim(),
        status: 'pending'
      })

    if (error) throw error
    setHasRequested(true)
  }

  return { hasRequested, loading, sendRequest }
}