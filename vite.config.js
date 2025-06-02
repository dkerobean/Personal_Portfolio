import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import handlebars from 'vite-plugin-handlebars';
import { resolve } from 'path';

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
  base: './',
  css: {
    postcss: './postcss.config.js',
  },
  assetsInclude: ['**/*.woff2', '**/*.woff', '**/*.ttf', '**/*.eot', '**/*.svg'],
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11']
    }),
    handlebars({
      partialDirectory: resolve(__dirname, 'src/components'),
      partials: ['src/components/*.html'],
      context(pagePath) {
        return pageData[pagePath];
      },
      reloadPartials: true
    })
  ],
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        about: resolve(__dirname, 'src/about.html'),
        blog: resolve(__dirname, 'src/blog.html'),
        contact: resolve(__dirname, 'src/contact.html'),
        projects: resolve(__dirname, 'src/projects.html'),
        service: resolve(__dirname, 'src/service.html')
      },
      output: {
        entryFileNames: 'assets/js/[name]-[hash].js',
        chunkFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    }
  },
  server: {
    open: true,
    port: 3000
  },
  publicDir: 'public',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
});
