FROM node:22 AS builder

WORKDIR /app

COPY package*.json .

RUN npm ci

COPY . .

RUN npx nx build api && \
    rm -rf node_modules && \
    cd dist/apps/api && \
    npm ci


FROM node:22-alpine AS runner

WORKDIR /app

COPY --from=builder /app/dist/apps/api .

EXPOSE 7200

CMD ["node", "/app/main.js"]
