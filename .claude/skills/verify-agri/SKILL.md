---
name: verify-agri
description: Cổng chất lượng cho AGRI-SCAN-AI — chạy build/lint/test đúng lệnh cho từng app (backend NestJS, ai-service Python, web Next.js, mobile Expo) và đọc output trước khi tuyên bố "xong/đã sửa/pass". Dùng bất cứ khi nào sắp khẳng định một thay đổi đã hoàn thành hoặc trước khi commit/merge.
---

# verify-agri — Cổng chất lượng theo app

Không tuyên bố "xong / đã sửa / pass" nếu chưa chạy lệnh phù hợp và đọc output. Bằng chứng trước, khẳng định sau.

## Chọn lệnh theo app bị ảnh hưởng

### backend (`apps/backend`)
```bash
pnpm build:backend               # build packages trước RỒI backend (bắt buộc dùng cái này)
# (pnpm --filter backend build đơn lẻ sẽ fail nếu @agri-scan/* chưa build)
pnpm --filter backend lint
pnpm --filter backend test       # nếu module đụng tới có *.spec.ts (auth, users, app)
```

### ai-service (`apps/ai-service`)
```bash
cd apps/ai-service
python -c "import ai.main"        # import không lỗi (sau khi cài requirements)
# nếu chạy được:
uvicorn ai.main:app --port 8000 &  # rồi: curl -s localhost:8000/  → {"status":"ok"}
```

### web (`apps/web`)
```bash
pnpm --filter web build           # bắt buộc cho thay đổi có logic
pnpm --filter web lint
```

### mobile (`apps/mobile`)
```bash
# Không build binary trong CI nhanh được → tối thiểu typecheck:
pnpm --filter mobile exec tsc --noEmit   # nếu có tsconfig phù hợp
# và mô tả rõ bước test thủ công trên Expo Go
```

### packages
```bash
pnpm --filter @agri-scan/database build
pnpm --filter @agri-scan/shared build
```

## Quy tắc
1. Chỉ chạy lệnh của app **thực sự bị ảnh hưởng** (tiết kiệm thời gian/token).
2. Đọc output; nếu fail → báo output lỗi, KHÔNG nói đã xong.
3. Không sửa test cho khớp code sai — sửa code cho khớp hành vi đúng.
4. Với thay đổi runtime, ưu tiên chạy thật (drive luồng) chứ không chỉ build.
5. Ghi lại lệnh đã chạy + kết quả tóm tắt trong báo cáo cuối.

## Khi không chạy được
Nếu môi trường thiếu (chưa cài deps, không có DB/Redis/GPU) → nói rõ "chưa verify được vì X", đề xuất cách user tự chạy (gợi ý dùng `! <lệnh>` trong phiên). Không giả vờ đã pass.
