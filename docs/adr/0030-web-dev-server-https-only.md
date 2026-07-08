# `web` dev server serves HTTPS only, no HTTP fallback

`ng serve` (`web:start`) serves exclusively over HTTPS at `localhost.www.craftsmans-ledger.dev:8080`, configured directly on the default `serve` options in `angular.json` rather than as an opt-in `https` configuration alongside a plain-HTTP default. Every contributor must complete the one-time mkcert + hosts-file setup before `web:start` works at all. This was chosen over a dual-mode (HTTP default / HTTPS opt-in) setup because an optional secondary path tends to go unexercised and rot; making HTTPS the only way to run `web` locally keeps it continuously verified.

Port `8080` (rather than Angular's default `4200`, or the privileged `443`) was chosen to match the port the containerized nginx runtime already exposes (see [ADR-0026](0026-rootless-nginx-runtime-for-web.md)), so the URL is identical whether `web` is running via `ng serve` or the Docker image.
