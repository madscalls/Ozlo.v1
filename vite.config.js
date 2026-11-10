import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves this repo at https://madscalls.github.io/Ozlo.v1/,
// so built asset paths need that prefix. Local `npm run dev` still works at /.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/Ozlo.v1/' : '/',
}));
