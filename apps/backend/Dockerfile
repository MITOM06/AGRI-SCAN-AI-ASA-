# --- Giai đoạn 1: BUILD ---
FROM node:20-alpine AS builder
ENV CI=true 
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

COPY . .
RUN pnpm install --frozen-lockfile

RUN pnpm --filter @agri-scan/shared build
RUN pnpm --filter @agri-scan/database build
RUN pnpm --filter backend build

# Gom hàng cho Production
RUN pnpm --filter backend --prod deploy /pruned --legacy
RUN cp -r apps/backend/dist /pruned/dist

# 🔥 BƯỚC MỚI: Copy dữ liệu JSON vào thư mục pruned để mang sang Runner
RUN mkdir -p /pruned/data
RUN cp apps/ai-service/data/plant_knowledge.json /pruned/data/
RUN cp apps/ai-service/data/plants_data.json /pruned/data/

# --- Giai đoạn 2: RUN ---
FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /pruned .

EXPOSE 4000
CMD ["node", "dist/main.js"]