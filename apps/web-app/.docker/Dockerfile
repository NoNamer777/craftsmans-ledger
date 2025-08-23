FROM --platform=$BUILDPLATFORM node:22 AS builder

WORKDIR /app

COPY package*.json .

RUN npm ci

COPY . .

RUN npx nx build web-app


FROM nginx:1.29 AS runner

COPY --from=builder /app/dist/apps/web-app/browser /usr/share/nginx/html
COPY apps/web-app/.docker/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
