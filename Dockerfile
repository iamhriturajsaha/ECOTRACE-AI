# Build Stage
FROM node:20-alpine AS builder
WORKDIR /app
# Install OpenSSL for Prisma
RUN apk add --no-cache openssl
COPY package*.json ./
RUN npm ci
COPY . .
# Generate Prisma Client
RUN npx prisma generate
# Build the Next.js app
RUN npm run build

# Production Stage
FROM node:20-alpine AS runner
WORKDIR /app

# Set environment to production
ENV NODE_ENV=production
# Next.js telemetry disable (optional)
ENV NEXT_TELEMETRY_DISABLED=1

# Install OpenSSL for Prisma runtime
RUN apk add --no-cache openssl

# Copy necessary files from builder
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

# Cloud Run injects PORT environment variable
ENV PORT=8080
EXPOSE 8080

# Start the application using the standalone build
CMD ["node", "server.js"]
