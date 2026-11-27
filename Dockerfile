# BoloPadho: production build of the Next.js app.
# Used by docker-compose.yml (`docker compose up`), which also starts MongoDB.

# 1. Install dependencies (exact versions from package-lock.json)
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# 2. Build. No secret keys are needed to build or to start.
FROM node:20-alpine AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 3. Run
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/next.config.js ./next.config.js
EXPOSE 3000
CMD ["npm", "start"]
