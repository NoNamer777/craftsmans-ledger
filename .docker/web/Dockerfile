# syntax=docker/dockerfile:1
#
# Build context is the repo root, not .docker/web:
#   docker build -f .docker/web/Dockerfile -t craftsmans-ledger-web .
#
# See docs/adr/0025-moon-docker-scaffold-pattern-for-web-image.md and
# docs/adr/0026-rootless-nginx-runtime-for-web.md for the rationale behind
# this stage layout.

#### BASE
FROM node:24.18.0-alpine AS base

WORKDIR /app

RUN apk add --no-cache git

RUN corepack enable && corepack prepare pnpm@11.9.0 --activate

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PNPM_HOME/bin:$PATH"

RUN pnpm add -g @moonrepo/cli@2.3.5


#### SKELETON
FROM base AS skeleton

COPY . .

RUN moon docker scaffold web


#### BUILD
FROM base AS build

COPY --from=skeleton /app/.moon/docker/configs .

RUN moon docker setup

COPY --from=skeleton /app/.moon/docker/sources .

COPY --from=skeleton /app/angular.json .

RUN moon run web:build


#### RUNTIME
FROM nginx:1.29-alpine AS runtime

COPY .docker/web/default.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/apps/web/dist/browser /usr/share/nginx/html

RUN chown -R nginx:nginx /var/cache/nginx /run /usr/share/nginx/html

USER nginx

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
