# Stage 1: Függőségek telepítése és fordítás
FROM node:22-alpine AS builder

WORKDIR /app

# Szükséges fordító eszközök a better-sqlite3 natív C++ modulhoz
RUN apk add --no-cache libc6-compat python3 make g++ gcc

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

# Next.js standalone build
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 2: Kicsi, produkciós futtató környezet
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV DATABASE_PATH="/app/data/subscriptions.db"

RUN apk add --no-cache libc6-compat

# Nem-root felhasználó a fokozott biztonságért
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Mappa létrehozása a perzisztens SQLite adatbázisnak
RUN mkdir -p /app/data && chown -R nextjs:nodejs /app/data

# Standalone build és statikus fájlok átmásolása
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

VOLUME ["/app/data"]

CMD ["node", "server.js"]
