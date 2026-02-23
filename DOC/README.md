# 🌿 AGRI-SCAN AI(ASA): BÁC SĨ CÂY TRỒNG THÔNG MINH

> **Dự án tham gia:** Website & AI Innovation Contest 2026 
> **Hạng mục:** Bảng A - Foundation Track
> **Trạng thái:** Đang phát triển (Drafting Docs)

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
4. **Community Knowledge:** Thư viện mở về các kỹ thuật canh tác nông nghiệp bền vững.

### 1.4. Giá trị cốt lõi (Core Values)
* **Chính xác:** Tận dụng sức mạnh của các mô hình Computer Vision tiên tiến.
* **Kịp thời:** Chẩn đoán ngay tại đồng ruộng chỉ với một chiếc smartphone.
* **Bền vững:** Ưu tiên các giải pháp sinh học và quy trình chăm sóc thân thiện môi trường.

## II. PHẠM VI SẢN PHẨM (SCOPE OF WORK - MVP)

Để đảm bảo tiến độ cuộc thi và tập trung vào tính năng cốt lõi có ứng dụng AI (tiêu chí ăn điểm nhất), phiên bản MVP (Minimum Viable Product) của Agri-Scan AI sẽ được giới hạn nghiêm ngặt như sau:

### 2.1. Tính năng cốt lõi (In Scope) BẮT BUỘC HOÀN THIỆN:
1. **Chẩn đoán bằng AI (AI Diagnosis):**
   * Người dùng tải lên hoặc chụp trực tiếp ảnh lá cây/thân cây bị bệnh.
   * Hệ thống xử lý ảnh và trả về kết quả: Tên bệnh, Độ tin cậy (%).
2. **Phác đồ điều trị & Lộ trình (Treatment Roadmap):**
   * Hiển thị thông tin chi tiết về loại bệnh hệ thống vừa nhận diện.
   * Đề xuất hướng xử lý tức thời (cắt tỉa, cách ly, loại thuốc sinh học khuyên dùng).
   * Gợi ý lộ trình chăm sóc phục hồi.
3. **Từ điển thực vật học (Plant Encyclopedia):**
   * Tra cứu danh sách các loại cây và các bệnh lý đặc trưng của chúng.
4. **Lịch sử & Quản lý (History):**
   * Lưu lại các phiên chẩn đoán để người dùng theo dõi tiến triển của cây.

### 2.2. Các tính năng KHÔNG LÀM trong giai đoạn này (Out of Scope):
* *Sàn thương mại điện tử:* Không tích hợp chức năng mua bán vật tư nông nghiệp/thuốc trừ sâu.
* *Cộng đồng/Mạng xã hội:* Chưa làm tính năng đăng bài, bình luận, chia sẻ phức tạp.
*(Lý do: Tập trung toàn lực vào độ mượt mà của hệ thống AI và trải nghiệm UI/UX).*

---

## III. QUY TẮC LÀM VIỆC NHÓM (TEAM CONVENTIONS)

> ⚠️ **QUAN TRỌNG:** Dự án tuân thủ tiêu chí Chấm điểm Mã nguồn mở (Open Source). Mọi thành viên BẮT BUỘC tuân thủ Git Workflow dưới đây để minh chứng cho kỹ năng quản lý dự án với Ban giám khảo.

### 3.1. Phân nhánh Git (Branching Strategy)
Sử dụng mô hình Git Flow cơ bản để tránh xung đột (conflict) code:
* `main`: Nhánh chứa source code hoàn chỉnh, ổn định nhất. Dùng để cấu hình CI/CD và Deploy. **TUYỆT ĐỐI KHÔNG PUSH TRỰC TIẾP LÊN NHÁNH NÀY.**
* `dev`: Nhánh trung tâm để tích hợp code từ các thành viên trong quá trình phát triển.
* `feature/<tên-tính-năng>`: Nhánh tạo ra để làm tính năng mới (VD: `feature/ai-scan-ui`, `feature/user-auth`).
* `fix/<tên-lỗi>`: Nhánh tạo ra để sửa bug (VD: `fix/camera-crash`).

### 3.2. Quy trình nộp code (Pull Request - PR)
1. Code xong tính năng ở nhánh `feature/...` của mình.
2. Push nhánh đó lên GitHub và tạo Pull Request (PR) yêu cầu gộp vào nhánh `dev`.
3. Phải có ít nhất 1 thành viên khác Review Code, báo cáo chạy thử không lỗi mới được Approve & Merge.

### 3.3. Chuẩn viết Commit (Conventional Commits)
Commit message phải rõ ràng, ngắn gọn và tuân thủ tiền tố sau:
* `feat:` Khi thêm một tính năng mới (VD: `feat: thêm API nhận diện ảnh cho NestJS`).
* `fix:` Khi sửa một lỗi hệ thống (VD: `fix: sửa lỗi crash UI trên React Native`).
* `docs:` Khi cập nhật tài liệu README, API Swagger (VD: `docs: cập nhật cấu trúc database`).
* `chore:` Khi cấu hình linh tinh, thêm thư viện (VD: `chore: setup file docker-compose cho MongoDB và Redis`).
* `refactor:` Khi tối ưu hóa lại code nhưng không làm thay đổi tính năng.

---
## IV. KIẾN TRÚC HỆ THỐNG & CÔNG NGHỆ (TECH STACK & ARCHITECTURE)

Dự án áp dụng kiến trúc **Monolithic (Nguyên khối)** để tối ưu thời gian phát triển, dễ dàng đóng gói, nhưng vẫn giữ cấu trúc code phân mô-đun (Modular) rõ ràng để dễ bảo trì. Toàn bộ hệ thống sử dụng ngôn ngữ **TypeScript** nhằm đảm bảo tính đồng nhất.

### 4.1. Hệ thống Backend (Core API & AI Gateway)
* **Framework:** **NestJS (Node.js).** * *Lý do:* Cấu trúc chặt chẽ, dễ dàng phân chia các module (Users, Plants, AI-Scan) trong cùng một khối Monolithic mà không bị rối rắm.
    * *Tích hợp AI:* NestJS xử lý rất tốt việc nhận file ảnh từ client, sau đó gọi các AI APIs bên thứ ba (như Google Vision API hoặc Plant.id) thông qua HTTP Module, phân tích kết quả và trả về cho người dùng.
* **Cơ sở dữ liệu (Database):** **MongoDB.**
    * *Lý do:* Cơ sở dữ liệu NoSQL cực kỳ linh hoạt để lưu trữ các tài liệu dạng JSON. Các thông tin về đặc điểm sinh học của cây, triệu chứng bệnh rất đa dạng, dùng MongoDB sẽ dễ mở rộng trường dữ liệu hơn SQL truyền thống.
* **Bộ nhớ đệm (Caching):** **Redis.**
    * *Lý do:* Tăng tốc độ phản hồi và tiết kiệm chi phí gọi AI API. Khi người dùng quét một loại bệnh phổ biến, kết quả chẩn đoán và phác đồ điều trị sẽ được lưu tạm vào Redis. Các yêu cầu tương tự sau đó sẽ được trả về ngay lập tức từ Redis thay vì phải chọc vào Database hoặc gọi lại AI.

### 4.2. Hệ thống Frontend (Đa nền tảng)
* **Mobile App (iOS & Android):** **React Native (với Expo).**
    * *Lý do:* Code một lần, build ra cả ứng dụng iOS và Android. Tốc độ làm UI cực nhanh. Dễ dàng sử dụng các thư viện Camera để chụp ảnh lá cây và gửi lên Backend. Bạn có thể dễ dàng test trực tiếp hiệu năng quét ảnh trên các thiết bị thật chạy iOS lẫn Android.
* **Web Interface:** **React (Vite) hoặc Next.js.**
    * *Lý do:* Dùng chung hệ sinh thái React với Mobile App, có thể tái sử dụng logic hoặc các component giao diện. Website sẽ đóng vai trò là Landing Page giới thiệu app, tra cứu từ điển cây trồng và là trang Admin quản lý dữ liệu.

### 4.3. Hạ tầng & Triển khai (DevOps & Deployment)
* **Đóng gói (Containerization):** **Docker & Docker Compose.**
    * Toàn bộ hệ thống Backend, MongoDB và Redis sẽ được đóng gói bằng Docker.
    * Chỉ với một file `docker-compose.yml` và lệnh `docker-compose up -d`, bất kỳ ai trong nhóm (hoặc Ban giám khảo) đều có thể dựng toàn bộ môi trường backend lên máy cá nhân trong 3 phút mà không lo lỗi phiên bản môi trường.
* **Triển khai Cloud (Hosting):**
    * Backend & Database: Deploy lên Google Cloud Platform (GCP) (Sử dụng Compute Engine hoặc Cloud Run hỗ trợ Docker cực tốt).
    * Web Frontend: Deploy miễn phí và tự động qua Vercel hoặc Firebase Hosting.

## V. THIẾT KẾ CƠ SỞ DỮ LIỆU (DATABASE SCHEMA)

Dự án sử dụng **MongoDB**, áp dụng nguyên tắc thiết kế NoSQL: Hạn chế join (lookup) phức tạp, ưu tiên tốc độ đọc dữ liệu và dễ dàng mở rộng trường thông tin khi tích hợp với các bộ dữ liệu mở (như PlantVillage, Kaggle Datasets).

Hệ thống bao gồm 4 Collections (Bảng) cốt lõi:

### 5.1. Collection: `users`
Lưu trữ thông tin người dùng. Giữ cấu trúc đơn giản cho MVP.
* `_id`: ObjectId
* `email`: String (Unique)
* `password`: String (Hashed)
* `fullName`: String
* `role`: String (Enum: `FARMER`, `EXPERT`, `ADMIN`) - *Phục vụ cho việc mở rộng tính năng hỏi đáp chuyên gia sau này.*
* `createdAt`: Date

### 5.2. Collection: `plants` (Khớp với dữ liệu phân loại thực vật học)
Thiết kế này bám sát cấu trúc của Wikipedia API và cơ sở dữ liệu thực vật, giúp bạn dễ dàng cào (crawl) data hoặc import từ file JSON có sẵn.
* `_id`: ObjectId
* `commonName`: String (Tên thường gọi - VD: "Cà chua", "Sầu riêng")
* `scientificName`: String (Tên khoa học - VD: "Solanum lycopersicum" - *Rất quan trọng vì AI API quốc tế thường trả về tên khoa học*).
* `family`: String (Họ thực vật)
* `description`: String (Mô tả đặc điểm sinh trưởng)
* `images`: Array of Strings (Danh sách URL ảnh minh họa cây khỏe mạnh)
* `diseases`: Array of ObjectIds (Ref -> `diseases`) - *Danh sách các bệnh thường gặp trên loại cây này.*

```json
// Ví dụ 1 Document trong Collection Plants:
{
  "commonName": "Cà chua"
  "scientificName": "Solanum lycopersicum",
  "family": "Solanaceae",
  "description": "Cây thân thảo, ưa sáng, cần nhiều nước giai đoạn ra hoa...",
  "diseases": ["id_benh_dom_vong", "id_benh_heo_xanh"]
}

### 5.3. Collection: `diseases` (Từ điển bệnh lý)
Bảng này lưu trữ thông tin chi tiết về các loại bệnh, nguyên nhân và phác đồ điều trị.
* `_id`: ObjectId
* `name`: String (Tên bệnh - VD: "Bệnh đốm vòng / Early Blight")
* `pathogen`: String (Tác nhân gây bệnh - VD: "Nấm Alternaria solani")
* `type`: String (Enum: `FUNGUS` (Nấm), `BACTERIA` (Vi khuẩn), `VIRUS`, `PEST` (Sâu hại), `NUTRIENT` (Thiếu chất)).
* `symptoms`: Array of Strings (Danh sách triệu chứng để người dùng tự đối chiếu).
* `treatments`: Object (Phác đồ điều trị được chia nhóm rõ ràng):
  * `biological`: Array of Strings (Biện pháp sinh học/hữu cơ - Xu hướng nông nghiệp hiện nay).
  * `chemical`: Array of Strings (Thuốc hóa học gợi ý).
  * `preventive`: Array of Strings (Cách phòng ngừa cho vụ sau).

```json
// Ví dụ 1 Document trong Collection Diseases:
{
  "name": "Bệnh Đốm Vòng (Early Blight)",
  "pathogen": "Nấm Alternaria solani",
  "type": "FUNGUS",
  "symptoms": ["Xuất hiện vòng tròn đồng tâm trên lá cũ", "Lá vàng và rụng dần"],
  "treatments": {
    "biological": ["Sử dụng chế phẩm sinh học Trichoderma", "Cắt tỉa lá bệnh tiêu hủy"],
    "chemical": ["Phun thuốc có hoạt chất Mancozeb hoặc Chlorothalonil"],
    "preventive": ["Luân canh cây trồng", "Giữ khoảng cách trồng thoáng gió"]
  }
}
5.4. Collection: scan_histories (Lịch sử quét AI)
_id: ObjectId
userId: ObjectId (Ref -> users)
imageUrl: String (URL ảnh người dùng upload, lưu trên AWS S3 hoặc Firebase Storage).
aiPredictions: Array of Objects (Kết quả AI trả về, lưu dạng mảng vì AI luôn trả về nhiều dự đoán kèm tỉ lệ %):
diseaseId: ObjectId (Ref -> diseases)
confidence: Number (Độ tự tin của AI - VD: 0.95 tương đương 95%).
isAccurate: Boolean (Người dùng xác nhận AI nhận diện đúng hay sai - Tính năng thu thập feedback cực kỳ ghi điểm với giám khảo).
scannedAt: Date

```markdown
## VI. MÔ HÌNH KINH DOANH & ĐỊNH HƯỚNG PHÁT TRIỂN (BUSINESS MODEL)

Dù ở giai đoạn MVP tập trung vào công nghệ, dự án vẫn vạch ra lộ trình sinh lời rõ ràng để đảm bảo tính bền vững:
1. **Freemium Model (Mô hình miễn phí cơ bản):**
   * *Miễn phí:* Giới hạn số lượt quét AI mỗi ngày (VD: 3 lượt/ngày), truy cập từ điển cơ bản.
   * *Premium (Gói cước tháng/năm):* Quét AI không giới hạn, lưu trữ lịch sử trọn đời, mở khóa lộ trình chăm sóc chuyên sâu (Care Roadmap) và chat trực tiếp với chuyên gia nông nghiệp.
2. **B2B Affiliate & Partnership (Tương lai):**
   * Hợp tác với các đại lý vật tư nông nghiệp, vườn ươm để gợi ý sản phẩm sinh học (phân bón, thuốc) trực tiếp trong phác đồ điều trị, nhận hoa hồng trên mỗi lượt chuyển đổi (Affiliate).

## VII. LỘ TRÌNH PHÁT TRIỂN (ROADMAP)

* **Giai đoạn 1 (Tháng 1 - Tháng 2):** Hoàn thiện UI/UX, khởi tạo cấu trúc Monorepo, thiết kế Database và API cơ bản bằng NestJS.
* **Giai đoạn 2 (Tháng 3):** Tích hợp AI Model (Computer Vision), xử lý logic nhận diện bệnh và trả về phác đồ điều trị. Áp dụng Redis Cache để tối ưu tốc độ.
* **Giai đoạn 3 (Tháng 4):** Testing trên thiết bị thật (iOS/Android), đóng gói Docker, Deploy hệ thống lên GCP/Vercel và chuẩn bị Pitching Demo.

