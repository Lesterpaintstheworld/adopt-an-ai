import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import ViteYaml from '@modyfi/vite-plugin-yaml'
import { plugin as markdown } from 'vite-plugin-markdown'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    ViteYaml(),
    markdown({
      mode: ['html', 'toc'],
      markdownIt: {
        html: true,
        linkify: true,
        typographer: true,
      },
      frontmatter: true
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'content': path.resolve(__dirname, './content')
    }
  }
})
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import markdown from 'vite-plugin-markdown';

export default defineConfig({
  plugins: [
    react(),
    markdown({
      mode: ['html', 'toc'],
      markdownIt: {
        html: true,
        linkify: true,
        typographer: true,
      }
    })
  ]
});
