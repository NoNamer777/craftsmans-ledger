FROM --platform=$BUILDPLATFORM node:24.12.0 AS builder

WORKDIR /app

COPY package*.json .

RUN npm ci

COPY . .

RUN npx nx build api


FROM node:24.12.0-alpine3.23

WORKDIR /app

COPY --from=builder /app .

EXPOSE 7200

CMD ["node", "/app/main.js"]
