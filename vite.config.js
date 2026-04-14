import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    // Use jsdom to simulate a browser environment
    environment: 'jsdom',
    // This file runs before every test file
    // It sets up the extra jest-dom matchers
    setupFiles: './src/tests/setup.js',
    // Makes test functions like describe/it/expect
    // available globally without importing them
    globals: true,
  }
})