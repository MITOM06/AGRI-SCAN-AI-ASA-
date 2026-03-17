export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Chính sách bảo mật
          </h1>

          <div className="prose max-w-none">
            <p className="text-gray-600 mb-6">
              Chúng tôi cam kết bảo vệ quyền riêng tư và thông tin cá nhân của
              bạn khi sử dụng dịch vụ Agri-Scan AI.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Thu thập thông tin
            </h2>
            <p className="text-gray-600 mb-6">
              Chúng tôi chỉ thu thập thông tin cần thiết để cung cấp dịch vụ
              chẩn đoán bệnh cây trồng.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. Sử dụng thông tin
            </h2>
            <p className="text-gray-600 mb-6">
              Thông tin được sử dụng để cải thiện độ chính xác của việc chẩn
              đoán và phát triển dịch vụ.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. Bảo mật thông tin
            </h2>
            <p className="text-gray-600 mb-6">
              Chúng tôi sử dụng các biện pháp bảo mật hiện đại để bảo vệ thông
              tin của bạn.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Chia sẻ thông tin
            </h2>
            <p className="text-gray-600 mb-6">
              Chúng tôi không chia sẻ thông tin cá nhân với bên thứ ba mà không
              có sự đồng ý của bạn.
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
