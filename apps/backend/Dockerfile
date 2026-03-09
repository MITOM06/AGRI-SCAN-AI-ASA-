# 1. Giai đoạn Build
FROM node:20-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# Copy toàn bộ source code Monorepo vào
COPY . .

# Cài đặt dependencies
RUN pnpm install --frozen-lockfile

# Build thư viện shared và database trước
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

# Đổi thành 4000 cho khớp với docker-compose
EXPOSE 4000

CMD ["node", "apps/backend/dist/main.js"]