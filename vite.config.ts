import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  build: {
    sourcemap: true
  },
  plugins: [reactRouter(), tsconfigPaths()],
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler'
      }
    },
    modules: {
      localsConvention: 'camelCase'
    }
  }
});
