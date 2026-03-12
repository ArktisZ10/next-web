import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['app/**/*.{ts,tsx}', 'db/**/*.{ts,tsx}', 'lib/**/*.{ts,tsx}'],
      exclude: [
        'app/**/*.test.{ts,tsx}',
        'app/**/*.spec.{ts,tsx}',
        'app/layout.tsx',
        'app/globals.css',
        'app/favicon.ico',
        '**/_components/**',
        '**/loading.tsx',
        '**/error.tsx',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
