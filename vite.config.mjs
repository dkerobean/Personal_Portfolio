import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import handlebars from 'vite-plugin-handlebars';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const pageData = {
  '/index.html': {
    title: 'Home',
  },
  '/about.html': {
    title: 'About',
  },
  '/blog.html': {
    title: 'Blog',
  },
  '/contact.html': {
    title: 'Contact',
  },
  '/projects.html': {
    title: 'Projects',
  },
  '/service.html': {
    title: 'Services',
  },
};

export default defineConfig({
  root: 'src',
  base: '/',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        'index': resolve(process.cwd(), 'src', 'index.html'),
        'about': resolve(process.cwd(), 'src', 'about.html'),
        'blog': resolve(process.cwd(), 'src', 'blog.html'),
        'contact': resolve(process.cwd(), 'src', 'contact.html'),
        'projects': resolve(process.cwd(), 'src', 'projects.html'),
        'service': resolve(process.cwd(), 'src', 'service.html'),
        'blog-details': resolve(process.cwd(), 'src', 'blog-details.html'),
        'single-project': resolve(process.cwd(), 'src', 'single-project.html')
      }
    }
  },
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11']
    }),
    handlebars({
      partialDirectory: resolve(__dirname, 'src/components'),
      context(pagePath) {
        // Convert the pagePath to match the keys in pageData
        const normalizedPath = '/' + pagePath.split('/').pop();
        return pageData[normalizedPath] || {};
      },
    })
  ],
  server: {
    open: true,
    port: 3000
  },
  publicDir: 'public',
  resolve: {
    alias: {
      '@': resolve(process.cwd(), 'src')
    }
  }
});
