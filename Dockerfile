# Base image
FROM node:18-slim AS base
ENV CI=true

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build stage
FROM base AS builder
WORKDIR /app

ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_DOMAIN_URL

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_DOMAIN_URL=$NEXT_PUBLIC_DOMAIN_URL

RUN npm run build

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs
EXPOSE 3000
CMD ["npm", "start"]
