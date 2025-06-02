import { getPageContent, getComponent, supabase } from '../../utils/supabase'

// Loading state handler
const loadingStates = {
  showLoading() {
    const preloader = document.querySelector('.preloader')
    if (preloader) preloader.style.display = 'flex'
  },
  hideLoading() {
    const preloader = document.querySelector('.preloader')
    if (preloader) {
      preloader.style.opacity = '0'
      setTimeout(() => {
        preloader.style.display = 'none'
      }, 500)
    }
  }
}

async function loadComponents() {
  const componentSlots = document.querySelectorAll('[data-component]')

  for (const slot of componentSlots) {
    const componentName = slot.dataset.component
    const component = await getComponent(componentName)
    if (component) {
      slot.innerHTML = component.content
    }
  }
}

async function initializePage() {
  // Get current page slug from URL
  const path = window.location.pathname
  const slug = path === '/' ? 'index' : path.replace(/^\/|\.html$/g, '')

  // Load page content
  const page = await getPageContent(slug)
  if (page) {
    document.title = page.title
    if (page.meta_description) {
      document.querySelector('meta[name="description"]').content = page.meta_description
    }

    // Update main content
    const mainContent = document.querySelector('main')
    if (mainContent) {
      mainContent.innerHTML = page.content
    }
  }

  // Load components
  await loadComponents()

  // Initialize any scripts that depend on dynamic content
  initializeScripts()
}

// Initialize your existing scripts after content is loaded
function initializeScripts() {
  // Your existing initialization code from script.js
  if (typeof initializeSliders === 'function') initializeSliders()
  if (typeof initializeAnimations === 'function') initializeAnimations()
  // ... other initializations
}

// Start loading content when DOM is ready
document.addEventListener('DOMContentLoaded', initializePage)
