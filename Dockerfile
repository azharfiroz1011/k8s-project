# ─────────────────────────────────────────────────────────────
# Stage 1 — Install dependencies
# ─────────────────────────────────────────────────────────────
FROM node:18-alpine AS deps

WORKDIR /app

# Copy manifests first — layer cache reused if deps don't change
COPY package*.json ./
RUN npm ci --only=production

# ─────────────────────────────────────────────────────────────
# Stage 2 — Runtime (non-root, minimal image)
# ─────────────────────────────────────────────────────────────
FROM node:18-alpine AS runtime

# Non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

WORKDIR /app

# Carry over production node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application source
COPY src/ ./src/
COPY public/ ./public
COPY package.json ./

EXPOSE 3000

# k8s liveness probe hits /health
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/health | grep -q '"status":"UP"' || exit 1

CMD ["node", "src/server.js"]
