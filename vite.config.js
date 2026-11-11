import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves this repo at https://madscalls.github.io/Ozlo.v1/,
// so built (and previewed) asset paths need that prefix. `npm run dev` still works at /.
export default defineConfig(({ command, isPreview }) => ({
  plugins: [react()],
  base: command === 'build' || isPreview ? '/Ozlo.v1/' : '/',
}));
