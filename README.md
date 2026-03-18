# 🌿 AGRI-SCAN AI(ASA): BÁC SĨ CÂY TRỒNG THÔNG MINH

> **Dự án tham gia:** Website & AI Innovation Contest 2026 
> **Hạng mục:** Bảng A - Foundation Track
> **Trạng thái:** Đang phát triển (Drafting Docs)

![Build Status](https://img.shields.io/badge/Status-Developing-yellow?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-NestJS%20|%20React%20Native%20|%20MongoDB-blue?style=for-the-badge)

## I. TỔNG QUAN DỰ ÁN (PROJECT OVERVIEW)

### 1.1. Giới thiệu dự án
**Agri-Scan AI** là hệ thống đa nền tảng (Web & Mobile App) ứng dụng trí tuệ nhân tạo nhằm hỗ trợ nông dân và người yêu cây cảnh trong việc quản lý sức khỏe cây trồng. Hệ thống đóng vai trò như một "trợ lý nông nghiệp ảo", giúp chẩn đoán bệnh nhanh chóng và đưa ra giải pháp chăm sóc khoa học.

### 1.2. Bối cảnh & Vấn đề (The Problem)
Hiện nay, ngành nông nghiệp đang đối mặt với nhiều thách thức:
* **Nhận diện sai lệch:** Nông dân thường nhầm lẫn giữa các loại bệnh có triệu chứng giống nhau, dẫn đến dùng sai thuốc, gây lãng phí và ô nhiễm.
* **Tiếp cận thông tin chậm:** Việc chờ đợi chuyên gia xuống thực địa mất nhiều thời gian, khiến dịch bệnh lây lan nhanh.
* **Thiếu lộ trình chăm sóc:** Người trồng cây đô thị (Home-farming) thường thiếu kiến thức về quy trình bón phân, tưới nước đúng cách.

### 1.3. Giải pháp (The Solution)
Hệ thống Agri-Scan AI cung cấp bộ giải pháp toàn diện:
1. **AI Diagnosis:** Nhận diện bệnh cây qua ảnh chụp tức thời với độ chính xác cao.
2. **Smart Treatment:** Đưa ra phác đồ điều trị chi tiết (nguyên nhân, cách xử lý, loại phân bón/thuốc khuyến nghị).
3. **Care Roadmap:** Xây dựng lộ trình chăm sóc định kỳ cho từng giai đoạn phát triển của cây.
4. **Community & Shop:** Kết nối cộng đồng và cung cấp vật tư nông nghiệp an toàn.

---

### 1.4. Giá trị cốt lõi (Core Values)
* **Chính xác:** Tận dụng sức mạnh của các mô hình Computer Vision tiên tiến.
* **Kịp thời:** Chẩn đoán ngay tại đồng ruộng chỉ với một chiếc smartphone.
* **Bền vững:** Ưu tiên các giải pháp sinh học và quy trình chăm sóc thân thiện môi trường.

---

## II. PHẠM VI SẢN PHẨM (SCOPE OF WORK - MVP)

Để đảm bảo tiến độ cuộc thi và tập trung vào tính năng cốt lõi có ứng dụng AI (tiêu chí ăn điểm nhất), phiên bản MVP (Minimum Viable Product) của Agri-Scan AI sẽ được giới hạn nghiêm ngặt như sau:

### 2.1. Tính năng người dùng (Mobile & Web)
* **Chẩn đoán bằng AI (AI Diagnosis):** Người dùng chụp ảnh lá/thân cây, hệ thống xử lý (bằng model Python) và trả về tên bệnh cùng độ tin cậy[cite: 1, 2].
* **Phác đồ & Lộ trình (Treatment Roadmap):** Đề xuất hướng xử lý tức thời và lộ trình chăm sóc phục hồi[cite: 1].
* **My Garden (Khu vườn của tôi):** Quản lý cây trồng đang theo dõi. *Lưu ý: Tính năng này yêu cầu các gói nâng cấp. Gói Free sẽ không sử dụng được, gói Premium cho phép thêm tối đa 10 cây (mỗi cây được quản lý như một đối tượng độc lập).*
* **Từ điển thực vật học (Plant Encyclopedia):** Tra cứu thông tin các loại cây và bệnh lý đặc trưng[cite: 1].
* **Cửa hàng (Shop) & Đơn hàng:** Tích hợp sàn thương mại điện tử mua bán sản phẩm nông nghiệp sinh học[cite: 2].
* **Thời tiết (Weather):** Cập nhật tình hình thời tiết để có cảnh báo chăm sóc phù hợp[cite: 2].

### 2.2. Tính năng quản trị (Admin Dashboard)
* Quản lý người dùng, phân quyền hệ thống[cite: 2].
* Quản lý sản phẩm, đơn hàng và phản hồi (Feedback)[cite: 2].
* Báo cáo và thống kê (Reports)[cite: 2].

---

## III. QUY TẮC LÀM VIỆC NHÓM (TEAM CONVENTIONS)

> ⚠️ **QUAN TRỌNG:** Dự án tuân thủ tiêu chí Chấm điểm Mã nguồn mở (Open Source). Mọi thành viên BẮT BUỘC tuân thủ Git Workflow dưới đây để minh chứng cho kỹ năng quản lý dự án với Ban giám khảo.

### 3.1. Phân nhánh Git (Branching Strategy)
Sử dụng mô hình Git Flow cơ bản để tránh xung đột (conflict) code:
* `main`: Nhánh chứa source code hoàn chỉnh, ổn định nhất. Dùng để cấu hình CI/CD và Deploy. **TUYỆT ĐỐI KHÔNG PUSH TRỰC TIẾP LÊN NHÁNH NÀY.**
* `dev`: Nhánh trung tâm để tích hợp code từ các thành viên trong quá trình phát triển.
* `feature/<tên-tính-năng>`: Nhánh tạo ra để làm tính năng mới (VD: `feature/ai-scan-ui`).
* `fix/<tên-lỗi>`: Nhánh tạo ra để sửa bug (VD: `fix/camera-crash`).

### 3.2. Quy trình nộp code (Pull Request - PR)
1. Code xong tính năng ở nhánh `feature/...` của mình.
2. Push nhánh đó lên GitHub và tạo Pull Request (PR) yêu cầu gộp vào nhánh `dev`.
3. Phải có ít nhất 1 thành viên khác Review Code, báo cáo chạy thử không lỗi mới được Approve & Merge.

### 3.3. Chuẩn viết Commit (Conventional Commits)
* `feat:` Khi thêm một tính năng mới.
* `fix:` Khi sửa một lỗi hệ thống.
* `docs:` Khi cập nhật tài liệu README, API Swagger.
* `chore:` Khi cấu hình linh tinh, thêm thư viện.
* `refactor:` Khi tối ưu hóa lại code nhưng không làm thay đổi tính năng.

---

## IV. KIẾN TRÚC HỆ THỐNG & CÔNG NGHỆ (TECH STACK & ARCHITECTURE)

Dự án áp dụng kiến trúc **Monorepo** (quản lý bằng pnpm workspaces) để tối ưu hóa việc chia sẻ mã nguồn, đồng thời sử dụng mô hình Microservices phân tách rành mạch AI và Backend[cite: 2].

### 4.1. Hệ thống Backend (Core API & AI Gateway)
* **Framework:** **NestJS (Node.js).** * *Lý do:* Cấu trúc chặt chẽ, dễ dàng phân chia các module trong cùng một khối Monolithic. Xử lý tốt việc nhận file ảnh từ client, gọi AI APIs bên thứ ba, phân tích kết quả và trả về.
* **Cơ sở dữ liệu (Database):** **MongoDB.**
  * *Lý do:* Cơ sở dữ liệu NoSQL cực kỳ linh hoạt để lưu trữ các tài liệu. Thông tin về đặc điểm sinh học, triệu chứng bệnh rất đa dạng, dùng MongoDB dễ mở rộng trường dữ liệu hơn SQL.
* **Bộ nhớ đệm (Caching):** **Redis.**
  * *Lý do:* Tăng tốc độ phản hồi và tiết kiệm chi phí gọi AI API. Các yêu cầu quét bệnh phổ biến sẽ được cache lại để trả về ngay lập tức.

### 4.2. Hệ thống Frontend (Đa nền tảng)
* **Mobile App (iOS & Android):** **React Native (với Expo).**
  * *Lý do:* Code một lần, build ra cả ứng dụng iOS và Android. Tốc độ làm UI nhanh, dễ dàng tích hợp Camera để chụp ảnh lá cây.
* **Web Interface:** **React (Vite) hoặc Next.js.**
  * *Lý do:* Dùng chung hệ sinh thái React với Mobile App, tái sử dụng logic/component. Làm Landing Page và trang Admin quản lý dữ liệu.

### 4.3. Hạ tầng & Triển khai (DevOps & Deployment)
* **Đóng gói (Containerization):** **Docker & Docker Compose.**
  * Toàn bộ backend, MongoDB và Redis được đóng gói. Dựng môi trường nhanh chóng chỉ với `docker-compose up -d`.
* **Triển khai Cloud (Hosting):**
  * Backend & Database & Web Frontend: Deploy lên Google Cloud Platform (GCP).

---

## V. THIẾT KẾ CƠ SỞ DỮ LIỆU (DATABASE SCHEMA)

Dự án sử dụng **MongoDB**, áp dụng nguyên tắc thiết kế NoSQL: Hạn chế join phức tạp, ưu tiên tốc độ đọc. Hệ thống quản lý chặt chẽ hạn mức sử dụng của người dùng (Rate Limiting cho AI Scan & Prompt).

### 5.1. Collection: `users`
Lưu trữ thông tin người dùng, phân quyền và quản lý gói cước dịch vụ.

```typescript
export declare class User {
    email: string;
    password: string;
    fullName: string;
    role: string;
    plan: string;
    planExpiresAt: Date | null;
    dailyImageCount: number;
    dailyPromptCount: number;
    lastResetDate: Date;
}
```

### 5.2. Collection: `plants`
Khớp với dữ liệu phân loại thực vật học, lưu trữ thông số sinh trưởng chi tiết.

```typescript
export declare class Plant {
    commonName: string;
    scientificName: string;
    family: string;
    description: string;
    images: string[];
    uses: string;
    care: string;
    category: string[];
    growthRate: string;
    light: string;
    water: string;
    height: string;
    floweringTime: string;
    suitableLocation: string;
    soil: string;
    status: string;
    diseases: Disease[];
}
```

### 5.3. Collection: `diseases`
Từ điển bệnh lý chi tiết, nguyên nhân và phác đồ điều trị đa phương pháp.

```typescript
export declare class Disease {
    name: string;
    pathogen: string;
    type: string;
    symptoms: string[];
    treatments: Treatment;
    status: string;
}
```

### 5.4. Collection: `scan_histories` & `chat_histories`
Lưu vết quá trình tương tác của người dùng với hệ thống AI để theo dõi sự cải thiện của cây trồng.

```typescript
// Lịch sử nhận diện bệnh qua ảnh
declare class AIPrediction {
    diseaseId: Disease;
    confidence: number;
}

export declare class ScanHistory {
    userId: User;
    imageUrl: string;
    aiPredictions: AIPrediction[];
    isAccurate: boolean | null;
    scannedAt: Date;
}

// Lịch sử tư vấn với trợ lý AI
export interface IChatMessage {
    role: 'user' | 'ai';
    content: string;
    timestamp: Date;
}

export declare class ChatHistory {
    userId: Types.ObjectId | User;
    title: string;
    messages: IChatMessage[];
}
```

---

## VI. MÔ HÌNH KINH DOANH & ĐỊNH HƯỚNG PHÁT TRIỂN (BUSINESS MODEL)

Dù ở giai đoạn MVP tập trung vào công nghệ, dự án vẫn vạch ra lộ trình sinh lời rõ ràng để đảm bảo tính bền vững:
1. **Freemium Model (Mô hình miễn phí cơ bản):**
   * *Miễn phí:* Giới hạn số lượt quét AI mỗi ngày, truy cập từ điển cơ bản.
   * *Premium (Gói cước tháng/năm):* Quét AI và Chat không giới hạn, lưu trữ lịch sử trọn đời, mở khóa lộ trình chăm sóc chuyên sâu (Care Roadmap) và chat trực tiếp với chuyên gia nông nghiệp.
2. **B2B Affiliate & Partnership (Tương lai):**
   * Hợp tác với các đại lý vật tư nông nghiệp, vườn ươm để gợi ý sản phẩm sinh học (phân bón, thuốc) trực tiếp trong phác đồ điều trị, nhận hoa hồng trên mỗi lượt chuyển đổi (Affiliate).

---

## VII. LỘ TRÌNH PHÁT TRIỂN (ROADMAP)

* **Giai đoạn 1 (Tháng 1 - Tháng 2):** Hoàn thiện UI/UX, khởi tạo cấu trúc Monorepo, thiết kế Database và API cơ bản bằng NestJS.
* **Giai đoạn 2 (Tháng 3):** Tích hợp AI Model (Computer Vision), xử lý logic nhận diện bệnh và trả về phác đồ điều trị. Áp dụng Redis Cache để tối ưu tốc độ.
* **Giai đoạn 3 (Tháng 4):** Testing trên thiết bị thật (iOS/Android), đóng gói Docker, Deploy hệ thống lên GCP/Vercel và chuẩn bị Pitching Demo.