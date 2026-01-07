FROM --platform=$BUILDPLATFORM node:24.12.0 AS builder

WORKDIR /app

COPY package*.json .

RUN npm ci

COPY . .

RUN npx nx build admin-portal


FROM nginx:1.29.4-alpine3.23

COPY --from=builder /app/dist/apps/admin-portal/browser /usr/share/nginx/html
COPY apps/admin-portal/.docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["/usr/sbin/nginx", "-g", "daemon off;"]
