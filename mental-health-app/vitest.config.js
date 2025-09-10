// File: mental-health-app/vitest.config.js

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Configure the React plugin to process .js files.
  plugins: [react({
    // Make sure the React plugin processes files with .js extension.
    include: '**/*.{jsx,js}',
  })],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './setupTests.js',
    dir: '__tests__',
  },
});