FROM --platform=$BUILDPLATFORM node:22 AS builder

WORKDIR /app

COPY package*.json .

RUN npm ci

COPY . .

RUN npx nx build admin-portal


FROM nginx:1.29 AS runner

COPY --from=builder /app/dist/apps/admin-portal/browser /usr/share/nginx/html
COPY apps/admin-portal/.docker/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["/usr/sbin/nginx", "-g", "daemon off;"]
