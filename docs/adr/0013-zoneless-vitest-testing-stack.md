---
status: accepted
---

# Zoneless change detection and Vitest as the testing stack for `apps/web`

`apps/web` uses Angular's zoneless change detection instead of `zone.js`, and Vitest — with browser mode via Playwright restricted to Chromium, and `v8` code coverage — instead of Angular's traditional Karma/Jasmine default. Zoneless is the direction Angular itself is moving, and pairing it with Karma's zone.js-oriented test harness would work against that; Vitest's browser mode gives real-browser component tests without Karma's heavier setup, and restricting to Chromium keeps the setup fast since this is a single-maintainer project with no cross-browser support requirement.

## Consequences

- Coverage uses the `v8` provider, which only works against Chromium (it reads V8's native coverage via CDP). If WebKit/Firefox coverage is ever needed, the coverage provider needs revisiting to `istanbul`.
- E2E testing will also use Playwright, reusing the same browser-automation tool already pulled in for Vitest's browser mode, but is out of scope until a follow-up session.
