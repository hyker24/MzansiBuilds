import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'

export function useCollaborationRequests() {
  const { user } = useAuth()

  
  const [sentRequests, setSentRequests] = useState([])

  const [receivedRequests, setReceivedRequests] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) return
    fetchAllRequests()

    const subscription = supabase
      .channel(`collab-requests-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'collaboration_requests'
        },
        () => fetchAllRequests()
      )
      .subscribe()

    return () => supabase.removeChannel(subscription)
  }, [user])

  async function fetchAllRequests() {
    try {
      setLoading(true)

      const { data: sent, error: sentError } = await supabase
        .from('collaboration_requests')
        .select(`
          *,
          projects (
            id,
            name,
            stage,
            profiles (
              id,
              username,
              avatar_url
            )
          )
        `)
        .eq('sender_id', user.id)
        .order('created_at', { ascending: false })

      if (sentError) throw sentError

      const { data: received, error: receivedError } = await supabase
        .from('collaboration_requests')
        .select(`
          *,
          projects (
            id,
            name,
            stage
          ),
          profiles (
            id,
            username,
            avatar_url
          )
        `)
        .in(
          'project_id',
          await getUserProjectIds(user.id)
        )
        .neq('sender_id', user.id)
        .order('created_at', { ascending: false })

      if (receivedError) throw receivedError

      setSentRequests(sent || [])
      setReceivedRequests(received || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function getUserProjectIds(userId) {
    const { data, error } = await supabase
      .from('projects')
      .select('id')
      .eq('user_id', userId)

    if (error) return []
    return data.map(p => p.id)
  }

  async function respondToRequest(requestId, status) {
    const { error } = await supabase
      .from('collaboration_requests')
      .update({ status })
      .eq('id', requestId)

    if (error) throw error

    setReceivedRequests(prev =>
      prev.map(req =>
        req.id === requestId ? { ...req, status } : req
      )
    )
  }

  return {
    sentRequests,
    receivedRequests,
    loading,
    error,
    respondToRequest
  }
}
