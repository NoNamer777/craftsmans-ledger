---
status: accepted
---

# Rootless `nginx:1.29-alpine` runtime for `web`, not `nginx-unprivileged`

`apps/web`'s image (#92) is a pure client-side build — `angular.json`'s `web` project has no `server.ts`/SSR builder, just `@angular/build:application` emitting static assets to `apps/web/dist/browser` — so the runtime stage only needs a static file server, not a Node process. `nginx:1.29-alpine` was chosen over Caddy or a Node-based static server (e.g. `serve`) as the conventional, minimal-footprint choice for serving a production SPA build.

Rather than basing the runtime stage on `nginxinc/nginx-unprivileged`, it's built rootless on top of the standard `nginx:1.29-alpine` image directly: the Dockerfile `chown`s `/var/cache/nginx`, `/run` (where the base image's own, untouched `nginx.conf` already points its `pid` directive), and the copied `html` directory to the built-in `nginx` user, then switches to it via `USER nginx` before `CMD`. This stays on the far more common `nginx:alpine` base — better documented, more likely to already be familiar to whoever maintains this next — instead of a smaller, less-used unprivileged variant, at the cost of a couple of extra Dockerfile lines to do the hardening by hand.

`apps/web/.docker/default.conf` overrides only `/etc/nginx/conf.d/default.conf` — the base image's `/etc/nginx/nginx.conf` is left untouched and still `include`s it, so its mime types, log format, `sendfile`, and `keepalive_timeout` defaults keep coming from upstream instead of being hand-duplicated and drifting over time. `default.conf` only changes what actually needs to change for this setup: the unprivileged listen port 8080, and SPA client-side routing via `try_files $uri $uri/ /index.html;`. Running as non-root means nginx logs one harmless startup warning ("the 'user' directive makes sense only if the master process runs with super-user privileges, ignored") since the base `nginx.conf`'s `user nginx;` line is now moot — expected and standard for any stock nginx image run rootless, not worth suppressing by overriding the whole file just to drop one line.

## Consequences

- Anything running this container (a `docker run -p`, a compose file, a future orchestrator manifest) must map to container port 8080, not 80.
- If `web` grows an SSR build later, this ADR's runtime-stage choice (nginx serving a static build) no longer applies and needs revisiting alongside that change.
- A future change to this repo's nginx setup (e.g., adding gzip, custom headers) belongs in `apps/web/.docker/default.conf`'s `server` block, not a reintroduced full `nginx.conf` override — keep inheriting the base image's top-level defaults.
