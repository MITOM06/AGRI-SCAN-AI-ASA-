---
name: agri-orchestrator
description: Điều phối đội agent chuyên trách của AGRI-SCAN-AI (backend-nest, ai-service-py, web-next, mobile-expo, reviewer-qa) cho các tác vụ đa-app, refactor, debug tổng thể, thêm tính năng xuyên service. Dùng khi công việc chạm nhiều app cùng lúc, hoặc khi cần route việc tới đúng chuyên gia. Cũng dùng cho yêu cầu tiếp nối "làm lại", "cập nhật", "sửa tiếp", "chỉ phần X", "review lại", "debug tổng thể".
---

# agri-orchestrator — Điều phối đội AGRI-SCAN-AI

Route công việc tới đúng agent chuyên trách và điều phối khi việc chạm nhiều app. Đây là chế độ chạy mặc định cho tác vụ đa-app trong repo này.

## Đội hình (specialist pool)
| Agent | Phạm vi |
|-------|---------|
| `backend-nest` | `apps/backend` (NestJS, Mongo, RabbitMQ, Redis, auth) |
| `ai-service-py` | `apps/ai-service` (FastAPI, ViT-MoE/YOLO, RAG, Gemini) |
| `web-next` | `apps/web` (Next.js) |
| `mobile-expo` | `apps/mobile` (Expo/RN) |
| `reviewer-qa` | Review/QA xuyên suốt (generate-verify) |

Gọi agent bằng tool `Agent` với `model: "opus"`.

## Phase 0 — Kiểm tra ngữ cảnh (bắt buộc trước khi bắt đầu)
1. Có `_workspace/` cũ + user yêu cầu sửa một phần → **chạy lại một phần** (chỉ gọi agent liên quan).
2. Có `_workspace/` cũ + user cấp input mới → di chuyển sang `_workspace_prev/`, **chạy mới**.
3. Không có `_workspace/` → **chạy lần đầu**.

## Định tuyến (routing)
1. Xác định công việc chạm app nào (theo đường dẫn/từ khoá).
2. **1 app** → gọi thẳng agent tương ứng.
3. **Nhiều app** → chọn mô hình:
   - **Pipeline** (phụ thuộc tuần tự): ví dụ đổi shape response ai-service → cập nhật consumer backend → cập nhật service web/mobile. Chạy theo thứ tự, truyền kết quả qua file.
   - **Fan-out** (độc lập, song song): sửa cùng một loại lỗi ở nhiều app không phụ thuộc nhau → `run_in_background: true` cho từng agent.
4. **Luôn kết bằng generate-verify**: sau khi các chuyên gia xong, gọi `reviewer-qa` để đối chiếu ranh giới + chạy cổng chất lượng (`verify-agri`).

## Truyền dữ liệu
- Trung gian: ghi vào `_workspace/{phase}_{agent}_{artifact}.md`.
- Song song/độc lập: dùng return value của `Agent`.
- Thay đổi hợp đồng API/schema: ghi rõ shape mới vào `_workspace/contract.md` để các phía đọc chung.

## Xử lý lỗi
- Agent fail → thử lại 1 lần; vẫn fail → tiếp tục phần khác, ghi rõ mục còn thiếu trong báo cáo (không im lặng bỏ qua).
- Dữ liệu mâu thuẫn giữa các phía → không tự xoá; nêu cả hai nguồn để user quyết (đây là "ngã rẽ", xem CLAUDE.md Luật #1).

## Cổng chất lượng
Trước khi báo hoàn thành, chạy skill `verify-agri` cho các app bị ảnh hưởng và đọc output. Không tuyên bố "xong" nếu chưa có bằng chứng.

## Tác vụ tiếp nối
- "sửa tiếp phần X" → chỉ gọi lại agent của X, đọc diff/báo cáo trước từ `_workspace/`.
- "review lại" → gọi `reviewer-qa` trên phạm vi hiện tại.
- "debug tổng thể" → xem `## Kịch bản: Debug tổng thể`.

## Kịch bản test
**Luồng bình thường** — "Thêm trường `severity` vào kết quả scan":
1. `ai-service-py` thêm field vào `/predict` response → ghi `_workspace/contract.md`.
2. `backend-nest` đọc contract, cập nhật consumer + `ScanHistory`.
3. `web-next` + `mobile-expo` (fan-out) cập nhật hiển thị.
4. `reviewer-qa` đối chiếu shape 3 phía + chạy `verify-agri`.

**Luồng lỗi** — một agent build fail:
1. Nhận output lỗi, thử lại 1 lần với gợi ý cụ thể.
2. Vẫn fail → báo cáo nêu rõ app đó chưa xong + log lỗi; các app khác vẫn hoàn tất.

## Kịch bản: Debug tổng thể
1. `reviewer-qa` quét toàn repo, lập danh sách vấn đề theo severity vào `_workspace/issues.md`.
2. Orchestrator nhóm vấn đề theo app.
3. Fan-out các agent chuyên trách sửa theo nhóm (độc lập) hoặc pipeline (nếu phụ thuộc).
4. `reviewer-qa` verify lại toàn bộ + `verify-agri`.
5. Báo cáo tổng hợp: đã sửa gì, còn gì, bằng chứng.
