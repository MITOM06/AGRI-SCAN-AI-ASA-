# --- Giai đoạn 1: BUILD ---
FROM node:20-alpine AS builder

ENV CI=true
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

COPY . .

RUN pnpm install --frozen-lockfile

# Build gói dùng chung và Web
RUN pnpm --filter @agri-scan/shared build
ENV NEXT_PRIVATE_STANDALONE=true
RUN pnpm --filter web build

# --- Giai đoạn 2: RUN ---
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy các thành phần của standalone Next.js
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static

EXPOSE 3000
CMD ["node", "apps/web/server.js"]