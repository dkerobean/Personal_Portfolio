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
  base: './',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: Object.keys(pageData).reduce((acc, page) => {
        acc[page.replace('.html', '')] = resolve(process.cwd(), 'src', page);
        return acc;
      }, {})
    }
  },
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11']
    }),
    handlebars({
      partialDirectory: resolve(__dirname, 'src/components'),
      context(pagePath) {
        return pageData[pagePath];
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
