import { supabase } from './supabase.js'
import { readFileSync } from 'fs'
import { resolve, join } from 'path'

const PAGES = [
  { slug: 'index', file: 'index.html', title: 'Home' },
  { slug: 'about', file: 'about.html', title: 'About' },
  { slug: 'blog', file: 'blog.html', title: 'Blog' },
  { slug: 'contact', file: 'contact.html', title: 'Contact' },
  { slug: 'projects', file: 'projects.html', title: 'Projects' },
  { slug: 'service', file: 'service.html', title: 'Services' }
]

const COMPONENTS = [
  { name: 'head', file: 'components/head.html' },
  { name: 'header', file: 'components/header.html' },
  { name: 'footer', file: 'components/footer.html' },
  { name: 'scripts', file: 'components/scripts.html' }
]

async function migrateContent() {
  try {
    // Migrate pages
    for (const page of PAGES) {
      const content = readFileSync(
        resolve(process.cwd(), 'src', page.file),
        'utf-8'
      )

      const { error } = await supabase
        .from('pages')
        .upsert({
          slug: page.slug,
          title: page.title,
          content: content,
          meta_description: `${page.title} - Modern Portfolio Template`
        })

      if (error) throw error
      console.log(`Migrated page: ${page.slug}`)
    }

    // Migrate components
    for (const component of COMPONENTS) {
      const content = readFileSync(
        resolve(process.cwd(), 'src', component.file),
        'utf-8'
      )

      const { error } = await supabase
        .from('components')
        .upsert({
          name: component.name,
          content: content
        })

      if (error) throw error
      console.log(`Migrated component: ${component.name}`)
    }

    console.log('Migration completed successfully!')
  } catch (error) {
    console.error('Migration failed:', error)
  }
}

migrateContent()
