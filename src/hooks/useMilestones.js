import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export function useMilestones(projectId) {
  const [milestones, setMilestones] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!projectId) return
    fetchMilestones()
  }, [projectId])

  async function fetchMilestones() {
    try {
      const { data, error } = await supabase
        .from('milestones')
        .select('*')
        .eq('project_id', projectId)
        .order('achieved_at', { ascending: true })

      if (error) throw error
      setMilestones(data)
    } catch (err) {
      console.error('Error fetching milestones:', err)
    } finally {
      setLoading(false)
    }
  }

  async function addMilestone(name, description) {
    if (!name.trim()) return

    const { data, error } = await supabase
      .from('milestones')
      .insert({
        project_id: projectId,
        name: name.trim(),
        description: description?.trim() || null,
        achieved_at: new Date().toISOString()
      })
      .select() 
      .single()

    if (error) throw error

    setMilestones(prev => [...prev, data])
  }

  return { milestones, loading, addMilestone }
}