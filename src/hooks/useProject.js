import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export function useProject(projectId) {
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function fetchProject() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          profiles (
            id,
            username,
            avatar_url
          )
        `)
        .eq('id', projectId)
        .single()             

      if (error) throw error
      setProject(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!projectId) return
    fetchProject()

    const subscription = supabase
      .channel(`project-${projectId}`)
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'projects', filter: `id=eq.${projectId}` },
        () => fetchProject()
      )
      .subscribe()

    return () => supabase.removeChannel(subscription)
  }, [projectId])

  return { project, loading, error, refetch: fetchProject }
}