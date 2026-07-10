# Đóng góp & Quy tắc làm việc nhóm — AGRI-SCAN-AI

> ⚠️ **Quan trọng:** Dự án tuân thủ tiêu chí chấm điểm Mã nguồn mở (Open Source). Mọi thành viên **bắt buộc** tuân thủ Git Workflow dưới đây để minh chứng kỹ năng quản lý dự án với Ban giám khảo.

Xem thêm: [kiến trúc tổng thể](ARCHITECTURE.md) · [lộ trình & mô hình kinh doanh](ROADMAP.md).

## 1. Phân nhánh Git (Branching Strategy)

Sử dụng mô hình Git Flow cơ bản để tránh xung đột (conflict) code:

| Nhánh | Vai trò |
|-------|---------|
| `main` | Source code hoàn chỉnh, ổn định nhất. Dùng cho CI/CD & Deploy. **TUYỆT ĐỐI KHÔNG PUSH TRỰC TIẾP.** |
| `dev` | Nhánh trung tâm để tích hợp code từ các thành viên trong quá trình phát triển. |
| `feature/<tên-tính-năng>` | Nhánh làm tính năng mới (VD: `feature/ai-scan-ui`). |
| `fix/<tên-lỗi>` | Nhánh sửa bug (VD: `fix/camera-crash`). |
| `refactor/<phạm-vi>` | Nhánh tối ưu/dọn dẹp không đổi hành vi (VD: `refactor/harness-docs`). |

## 2. Quy trình nộp code (Pull Request)

1. Code xong tính năng ở nhánh `feature/...` của mình.
2. Push nhánh lên GitHub và tạo Pull Request (PR) yêu cầu gộp vào nhánh `dev`.
3. Phải có **ít nhất 1 thành viên khác** review code, báo cáo chạy thử không lỗi mới được Approve & Merge.

## 3. Chuẩn viết Commit (Conventional Commits)

| Prefix | Khi nào dùng |
|--------|--------------|
| `feat:` | Thêm một tính năng mới. |
| `fix:` | Sửa một lỗi hệ thống. |
| `docs:` | Cập nhật tài liệu (README, API Swagger, docs/). |
| `chore:` | Cấu hình linh tinh, thêm thư viện. |
| `refactor:` | Tối ưu hóa lại code nhưng không thay đổi tính năng. |

## 4. Cổng chất lượng trước khi mở PR

Trước khi tuyên bố "xong", **chạy thật** lệnh liên quan và đọc output (chi tiết trong [`CLAUDE.md`](../CLAUDE.md) mục 6):

```bash
pnpm build                    # packages → backend → web (đúng thứ tự)
pnpm --filter backend lint
pnpm --filter backend test
```

> Không sửa test cho khớp code sai; sửa code cho khớp hành vi đúng.
