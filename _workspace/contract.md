# API Contract — Reports Time-Series & Image Upload

Nguồn sự thật cho web (`apps/web`) + mobile (`apps/mobile`) khi thay mock data bằng API thật.
Backend đã build + lint pass. Tất cả method đã export từ `@agri-scan/shared`.

Global prefix backend = `api`. Base URL lấy từ env (`NEXT_PUBLIC_API_URL` / `EXPO_PUBLIC_API_URL`).
Các endpoint dưới đây gọi qua `axiosClient` trong `@agri-scan/shared` (đã tự gắn Bearer token).

---

## API 1a — Revenue time-series (thay `MOCK_REVENUE_DATA`)

- **Method + path**: `GET /api/admin/reports/revenue-series`
- **Auth**: bắt buộc — JWT + role `ADMIN` (JwtAuthGuard + RolesGuard, giống `getDashboard`).
- **Query params**:
  - `days` (number, optional, default `7`, hợp lệ `1..365`) — số ngày gần nhất tính đến hôm nay.
- **Response** — mảng, mỗi phần tử là 1 ngày (đã fill đủ ngày, ngày không có data = 0), sắp xếp tăng dần theo ngày:

```json
[
  { "date": "2026-07-18", "revenue": 0,       "PREMIUM": 0,      "VIP": 0 },
  { "date": "2026-07-19", "revenue": 1500000, "PREMIUM": 500000, "VIP": 1000000 }
]
```

- **Field names (chính xác)**:
  - `date`: string `'YYYY-MM-DD'` (UTC).
  - `revenue`: number — tổng doanh thu trong ngày (= `PREMIUM + VIP`), VND.
  - `PREMIUM`: number — doanh thu gói PREMIUM trong ngày.
  - `VIP`: number — doanh thu gói VIP trong ngày.
- **Nguồn dữ liệu**: collection `payments`, chỉ tính `status = 'SUCCESS'`, gộp theo ngày `createdAt`, breakdown theo `plan`.
- **Khớp chart `Reports.tsx`**: `BarChart` dùng `dataKey="date"`, `Bar dataKey="PREMIUM"`, `Bar dataKey="VIP"` → dùng trực tiếp, không cần map lại. Có thêm `revenue` để hiển thị tổng nếu cần.
- **Shared client**:
  ```ts
  import { adminApi } from "@agri-scan/shared";
  import type { IRevenueSeriesPoint } from "@agri-scan/shared";

  const data: IRevenueSeriesPoint[] = await adminApi.getRevenueSeries(7);
  ```
  Signature: `adminApi.getRevenueSeries(days = 7): Promise<IRevenueSeriesPoint[]>`

---

## API 1b — Usage time-series (thay `MOCK_USAGE_DATA`)

- **Method + path**: `GET /api/admin/reports/usage-series`
- **Auth**: bắt buộc — JWT + role `ADMIN`.
- **Query params**:
  - `days` (number, optional, default `7`, hợp lệ `1..365`).
- **Response** — mảng, mỗi phần tử là 1 ngày (đã fill đủ ngày, sắp xếp tăng dần):

```json
[
  { "date": "2026-07-18", "images": 0,  "prompts": 0 },
  { "date": "2026-07-19", "images": 12, "prompts": 34 }
]
```

- **Field names (chính xác)**:
  - `date`: string `'YYYY-MM-DD'` (UTC).
  - `images`: number — số lượt quét ảnh trong ngày (số bản ghi `ScanHistory` theo `createdAt`).
  - `prompts`: number — số câu hỏi chat AI trong ngày (số message `role='user'` trong `ChatHistory` theo `messages.timestamp`).
- **Khớp chart `Reports.tsx`**: `AreaChart` dùng `dataKey="date"`, `Area dataKey="images"`, `Area dataKey="prompts"` → dùng trực tiếp.
- **Shared client**:
  ```ts
  import { adminApi } from "@agri-scan/shared";
  import type { IUsageSeriesPoint } from "@agri-scan/shared";

  const data: IUsageSeriesPoint[] = await adminApi.getUsageSeries(7);
  ```
  Signature: `adminApi.getUsageSeries(days = 7): Promise<IUsageSeriesPoint[]>`

### Ghi chú tích hợp web `Reports.tsx`
- Bỏ import `MOCK_REVENUE_DATA`, `MOCK_USAGE_DATA` từ `./mockData`.
- Load song song với `getDashboard()`; đưa kết quả `getRevenueSeries`/`getUsageSeries` vào state riêng và truyền vào `data=` của `BarChart`/`AreaChart`.
- `avgDailyUsage` (đang tính từ `MOCK_USAGE_DATA`) → tính lại từ mảng usage-series thật: `sum(images + prompts) / length`.
- Dropdown "7 ngày / 30 ngày / Năm nay" có thể map sang `days = 7 | 30 | 365`.

---

## API 2 — Upload ảnh (thay URL Cloudinary giả ở mobile garden check-in)

- **Method + path**: `POST /api/upload/image`
- **Auth**: bắt buộc — JWT (`JwtAuthGuard`). Bất kỳ user đã đăng nhập (không cần ADMIN).
- **Content-Type**: `multipart/form-data`
- **Body**: field `image` = file ảnh.
  - Giới hạn: tối đa **10MB**, định dạng `jpg | jpeg | png | webp | heic`.
- **Response**:

```json
{ "url": "https://storage.googleapis.com/<bucket>/uploads/1690000000-123456789.jpg" }
```

- **Field names**: `url` (string) — public URL GCS, dùng trực tiếp làm `imageUrl`.
- **Lưu trữ**: GCS (cùng bucket / cùng service với luồng scan; ảnh nằm ở folder `uploads/`, ảnh scan ở `scans/`).
- **Shared client**:
  ```ts
  import { uploadApi } from "@agri-scan/shared";
  import type { IUploadResponse, UploadableFile } from "@agri-scan/shared";

  const { url } = await uploadApi.uploadImage(file);
  ```
  Signature: `uploadApi.uploadImage(file: UploadableFile): Promise<IUploadResponse>`
  - `UploadableFile = File | Blob | { uri: string; name?: string; type?: string }`
  - Web: truyền `File`/`Blob`.
  - Mobile (RN/Expo): truyền `{ uri, name, type }`, ví dụ:
    ```ts
    const { url } = await uploadApi.uploadImage({
      uri: result.assets[0].uri,
      name: "checkin.jpg",
      type: "image/jpeg",
    });
    ```

### Ghi chú tích hợp mobile `garden-detail.tsx` (~dòng 119)
Thay đoạn hardcode:
```ts
const uploadedImageUrl = "https://res.cloudinary.com/demo/image/upload/v1/sample.jpg";
```
bằng:
```ts
import { uploadApi } from "@agri-scan/shared";
const asset = result.assets[0];
const { url: uploadedImageUrl } = await uploadApi.uploadImage({
  uri: asset.uri,
  name: asset.fileName ?? "checkin.jpg",
  type: asset.mimeType ?? "image/jpeg",
});
```
Sau đó `uploadedImageUrl` truyền vào `myGardenApi.dailyCheckIn(plantId, { currentDay, imageUrl: uploadedImageUrl, lat, lon })` như cũ.

---

## Tóm tắt endpoint + shared method

| Chức năng | Method + path | Shared method | Auth |
|---|---|---|---|
| Revenue series | `GET /api/admin/reports/revenue-series?days=7` | `adminApi.getRevenueSeries(days?)` | JWT + ADMIN |
| Usage series | `GET /api/admin/reports/usage-series?days=7` | `adminApi.getUsageSeries(days?)` | JWT + ADMIN |
| Upload ảnh | `POST /api/upload/image` (field `image`) | `uploadApi.uploadImage(file)` | JWT |

Types export từ `@agri-scan/shared`: `IRevenueSeriesPoint`, `IUsageSeriesPoint`, `IUploadResponse`, `UploadableFile`.
Endpoint constants: `API_ENDPOINTS.ADMIN.REPORTS.REVENUE_SERIES`, `API_ENDPOINTS.ADMIN.REPORTS.USAGE_SERIES`, `API_ENDPOINTS.UPLOAD.IMAGE`.
