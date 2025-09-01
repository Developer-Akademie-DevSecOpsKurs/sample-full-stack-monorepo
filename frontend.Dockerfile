# ---------- Base ----------
FROM node:20.16-alpine3.20 AS base
RUN apk update && apk upgrade && apk add --no-cache libc6-compat
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# ---------- Dependencies (cached) ----------
FROM base AS deps
# Copy only manifest files first (add lock files if present)
COPY tickets-web/package*.json ./
# If you use npm: (uses build cache + local npm cache mount)
RUN --mount=type=cache,target=/root/.npm npm ci

# ---------- Builder ----------
FROM base AS builder
ENV NODE_ENV=production

ARG NEXT_PUBLIC_API_BASE_URL=/api \
    NEXT_PUBLIC_API_HOST=be-tickets
# Reuse installed deps
COPY --from=deps /app/node_modules ./node_modules
# Copy application source
COPY tickets-web/ .
# Build (expects "build" script and output: 'standalone' in next.config.ts)
RUN npm run build

# ---------- Development runtime ----------
FROM builder AS dev
ENV NODE_ENV=development
EXPOSE 3000
CMD ["npm","run","dev"]

# ---------- Production runtime ----------
FROM base AS prod
RUN apk update && apk upgrade && apk add --no-cache libc6-compat
WORKDIR /app
# Setup env-vars
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Non-root user
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

# Copy only runtime artifacts (standalone build) + static assets
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
HEALTHCHECK CMD wget -q -O - http://localhost:3000/ || exit 1
# server.js is part of standalone output
CMD ["node","server.js"]