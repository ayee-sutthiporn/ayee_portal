FROM node:25-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Run
FROM node:25-alpine

WORKDIR /app

# Copy built artifacts from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Install production dependencies only (optional, but good for keeping image small if needed)
# For SSR, we might need some deps, but usually the bundle has everything or we use the server.mjs
# If server.mjs needs node_modules, we should copy them or install prod deps.
# Angular SSR usually bundles dependencies, but let's verify if we need to install prod deps.
# For safety in this setup, we'll install production dependencies.
RUN npm ci --only=production --legacy-peer-deps

# Expose port
EXPOSE 4000

# Start the server
CMD ["node", "dist/AyeePortal/server/server.mjs"]
