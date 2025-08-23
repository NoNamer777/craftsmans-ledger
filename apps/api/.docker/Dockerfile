FROM --platform=$BUILDPLATFORM node:22 AS builder

WORKDIR /app

COPY package*.json .

RUN npm ci

COPY . .

RUN npx nx build api


FROM --platform=$BUILDPLATFORM node:22 AS packager

WORKDIR /app

COPY --from=builder /app/dist/apps/api .

RUN npm ci

COPY --from=builder /app/node_modules/.prisma node_modules/.prisma


FROM node:22-alpine AS runner

WORKDIR /app

COPY --from=packager /app .

EXPOSE 7200

CMD ["node", "/app/main.js"]
