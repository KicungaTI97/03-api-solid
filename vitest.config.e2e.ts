import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

console.log('Vitest configuration being loaded...');

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    include: ['./**/*.e2e-spec.ts'],
    dir: 'src',
    projects: [
      {
        extends: true,
        test: {
          name: 'e2e',
          environment: 'prisma/vitest-environment-prisma/prisma-test-environments.ts',
        },
      },
    ],
  },
});
