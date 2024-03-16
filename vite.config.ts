import { vitePlugin as remix } from '@remix-run/dev';
import { vercelPreset } from '@vercel/remix/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    remix({
      ssr: false,
      presets: [vercelPreset()]
    }),
    tsconfigPaths()
  ],
  css: {
    modules: {
      localsConvention: 'camelCase'
    }
  }
});
