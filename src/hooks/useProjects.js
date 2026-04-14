import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export function useProjects(userId = null) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProjects()

    const subscription = supabase
      .channel('projects-feed')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'projects' },
        () => fetchProjects()
      )
      .subscribe()

    return () => supabase.removeChannel(subscription)
  }, [userId])

  async function fetchProjects() {
    try {
      setLoading(true)

      let query = supabase
        .from('projects')
        .select(`
          *,
          profiles (
            id,
            username,
            avatar_url
          ),
          comments (count)
        `)
        .order('created_at', { ascending: false })

      if (userId) {
        query = query.eq('user_id', userId)
      }

      const { data, error } = await query
      if (error) throw error
      setProjects(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { projects, loading, error }
}