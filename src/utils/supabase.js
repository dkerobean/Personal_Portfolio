import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ngovcliohzwaqzfagfti.supabase.co'
const supabaseKey = process.env.VITE_SUPABASE_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// Function to fetch page content
export async function getPageContent(slug) {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching page:', error)
    return null
  }

  return data
}

// Function to fetch components
export async function getComponent(name) {
  const { data, error } = await supabase
    .from('components')
    .select('*')
    .eq('name', name)
    .single()

  if (error) {
    console.error('Error fetching component:', error)
    return null
  }

  return data
}
