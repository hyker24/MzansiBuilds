import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export function useComments(projectId) {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!projectId) return
    fetchComments()

    const subscription = supabase
      .channel(`comments-${projectId}-${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'comments',
          filter: `project_id=eq.${projectId}`
        },
        (payload) => {
          setComments(prev => [...prev, payload.new])
        }
      )
      .subscribe()

    return () => supabase.removeChannel(subscription)
  }, [projectId])

  async function fetchComments() {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles (
            id,
            username,
            avatar_url
          )
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: true })

      if (error) throw error
      setComments(data)
    } catch (err) {
      console.error('Error fetching comments:', err)
    } finally {
      setLoading(false)
    }
  }

  async function postComment(userId, body) {
    if (!body.trim()) return

    const { error } = await supabase
      .from('comments')
      .insert({
        project_id: projectId,
        user_id: userId,
        body: body.trim()
      })

    if (error) throw error
  }

  return { comments, loading, postComment }
}