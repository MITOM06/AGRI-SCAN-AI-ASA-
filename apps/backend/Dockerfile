# 1. Giai đoạn Build
FROM node:20-alpine AS builder

# Cài pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy toàn bộ source code Monorepo vào
COPY . .

# Cài đặt dependencies (chỉ cài những thứ cần thiết)
RUN pnpm install --frozen-lockfile

# Build thư viện shared trước
RUN pnpm --filter @agri-scan/shared build
RUN pnpm --filter @agri-scan/database build

# Build Backend
RUN pnpm --filter backend build

# 2. Giai đoạn Run (Production)
FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/package.json ./package.json

# Expose port
EXPOSE 3000

# Chạy lệnh start
CMD ["node", "apps/backend/dist/main.js"]