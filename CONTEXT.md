# Craftsman's Ledger

## Language

### CI / testing infrastructure

**E2E environment**:  
The Docker Compose stack (`web`'s image and a Caddy reverse proxy for HTTPS termination) that boots a running instance of `web` for tests to run against. Pure infrastructure — no test runner or test code involved.  
_Avoid_: E2E stack, E2E setup

**E2E suite**:  
The Playwright test code that exercises `web` by driving a browser against the E2E environment.  
_Avoid_: E2E stack, E2E tests (when precision matters — "E2E tests" is fine in casual conversation, but avoid it when the distinction from E2E environment matters)
