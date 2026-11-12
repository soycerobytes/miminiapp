import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          environment: 'node',
          include: [
            'tests/unit/**/*.test.ts',
            'src/miniapps/*/tests/**/*.test.ts',
          ],
        },
      },
      {
        plugins: [react()],
        test: {
          name: 'components',
          environment: 'jsdom',
          include: [
            'tests/components/**/*.test.tsx',
            'src/miniapps/*/tests/**/*.test.tsx',
          ],
          setupFiles: ['tests/components/setup.ts'],
        },
      },
    ],
  },
});
