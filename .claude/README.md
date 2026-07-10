# .claude/ — Harness của AGRI-SCAN-AI

Cấu hình đội agent + skill riêng cho dự án. Claude Code tự nạp metadata từ đây.

## Agents (`.claude/agents/`)
| Agent | Vai trò | Phạm vi |
|-------|---------|---------|
| `backend-nest` | NestJS specialist | `apps/backend` |
| `ai-service-py` | Python/FastAPI/ML | `apps/ai-service` |
| `web-next` | Next.js | `apps/web` |
| `mobile-expo` | Expo/React Native | `apps/mobile` |
| `reviewer-qa` | Review/QA xuyên suốt (generate-verify) | toàn repo |

Mọi agent chạy `model: opus`.

## Skills (`.claude/skills/`)
| Skill | Công dụng |
|-------|-----------|
| `agri-orchestrator` | Điều phối đa-app: routing tới agent, pipeline/fan-out, kết bằng QA |
| `verify-agri` | Cổng chất lượng: lệnh build/lint/test đúng cho từng app |

## Mô hình
**Specialist pool + generate-verify**: mỗi app 1 chuyên gia, `reviewer-qa` chốt chất lượng, `verify-agri` là cổng bằng chứng.

## Tiến hoá
Harness là hệ tiến hoá. Sau mỗi lần chạy lớn, cập nhật agent/skill và ghi vào bảng **Change history** trong `CLAUDE.md` (mục 8).

## Quy ước
- Không tạo `.claude/commands/`.
- Trung gian đa-app ghi vào `_workspace/` (đã đưa vào `.gitignore`).
