import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from "vite-plugin-svgr";
import { defineConfig as defineVitestConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react(), svgr()],
});

export const testConfig = defineVitestConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
});
