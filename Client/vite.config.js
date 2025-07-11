import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Ensure Render serves this
  },
  writeBundle() {
    const redirectsSrc = resolve(__dirname, 'public', '_redirects');
    const redirectsDest = resolve(__dirname, 'dist', '_redirects');

    if (fs.existsSync(redirectsSrc)) {
      fs.copyFileSync(redirectsSrc, redirectsDest);
      console.log('✅ Copied _redirects file to dist/');
    } else {
      console.warn('⚠️ _redirects file not found in public/');
    }
  },
})
