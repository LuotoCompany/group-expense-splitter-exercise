import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

import { playwright } from '@vitest/browser-playwright';

const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(dirname, './'),
    },
  },
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        '.storybook/',
        'stories/',
        '**/*.stories.tsx',
        '**/*.config.ts',
        '**/*.d.ts',
      ],
    },
    projects: [
      // Unit tests for lib/ utilities and domain logic
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['lib/**/*.test.ts', 'lib/**/*.test.tsx'],
          environment: 'jsdom',
          setupFiles: ['./test/setup.ts'],
        },
      },
      // Component tests for React components
      {
        extends: true,
        test: {
          name: 'component',
          include: ['components/**/*.test.tsx', 'app/**/*.test.tsx'],
          environment: 'jsdom',
          setupFiles: ['./test/setup.ts'],
        },
      },
      // Storybook visual tests
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({ configDir: path.join(dirname, '.storybook') }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
          setupFiles: ['.storybook/vitest.setup.ts'],
        },
      },
    ],
  },
});
