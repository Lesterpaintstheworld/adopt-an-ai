import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import ViteYaml from '@modyfi/vite-plugin-yaml';
import { plugin as markdown } from 'vite-plugin-markdown';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  return {
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
    define: {
      // Runtime config injected during build
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        'content': path.resolve(__dirname, './content')
      }
    },
    server: {
      port: 5174,
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    base: '/'
  };
});
