export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Điều khoản dịch vụ
          </h1>

          <div className="prose max-w-none">
            <p className="text-gray-600 mb-6">
              Nội dung điều khoản dịch vụ đang được cập nhật. Vui lòng quay lại
              sau để xem thông tin đầy đủ.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Chấp nhận điều khoản
            </h2>
            <p className="text-gray-600 mb-6">
              Bằng cách sử dụng dịch vụ Agri-Scan AI, bạn đồng ý tuân thủ các
              điều khoản này.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. Mục đích sử dụng
            </h2>
            <p className="text-gray-600 mb-6">
              Agri-Scan AI được thiết kế để hỗ trợ chẩn đoán bệnh cây trồng
              thông qua trí tuệ nhân tạo.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. Trách nhiệm người dùng
            </h2>
            <p className="text-gray-600 mb-6">
              Người dùng có trách nhiệm sử dụng dịch vụ một cách hợp lý và không
              vi phạm pháp luật.
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <a
              href="/register"
              className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
            >
              ← Quay lại đăng ký
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
