import { defineConfig, devices } from '@playwright/test';

// In CI, `web` is already up behind Caddy before this config is ever loaded —
// `docker compose up --wait` (see apps/web/.docker/compose.yaml) blocks the CI job
// itself until the environment reports healthy, so there's no `webServer` fallback
// here: a broken environment should fail loudly rather than silently falling back to
// `web:start`, which would mean testing the dev server instead of the built image.
// Locally, there's no Compose/Caddy environment at all (CI-only, see ADR-0039) — tests
// run against `web:start`'s dev server, reusing an already-running instance if there
// is one.
const isCI = !!process.env['CI'];

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: isCI,
    retries: isCI ? 2 : 0,
    reporter: isCI ? [['html', { open: 'never' }]] : 'list',
    use: {
        baseURL: isCI ? 'https://localhost:8443' : 'https://localhost.www.craftsmans-ledger.dev:8080',
        ignoreHTTPSErrors: true,
        trace: 'retain-on-failure',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
    ...(isCI
        ? {}
        : {
              webServer: {
                  command: 'pnpm moon run web:start',
                  url: 'https://localhost.www.craftsmans-ledger.dev:8080',
                  reuseExistingServer: true,
                  ignoreHTTPSErrors: true,
              },
          }),
});
