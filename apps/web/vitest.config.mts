import { defineConfig } from 'vitest/config';

// Browser selection, reporters, and watch mode are configured in `angular.json`'s
// `test` target, not here — see ADR-0022. Setting `browser.instances`/`name` here would
// concatenate with `angular.json`'s `browsers` option and silently double-run every test.
export default defineConfig({
    test: {
        browser: {
            screenshotFailures: false,
        },
        coverage: {
            reportsDirectory: 'coverage',
        },
        open: false,
        root: import.meta.dirname,
    },
});
