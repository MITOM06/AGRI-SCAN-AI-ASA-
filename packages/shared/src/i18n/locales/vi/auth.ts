/**
 * Đăng nhập, đăng ký, quên mật khẩu, OTP.
 *
 * `validation` được zod dùng làm KEY chứ không phải chuỗi hiển thị
 * (xem packages/shared/src/schemas/auth.schema.ts). Component render bằng
 * t(errors.field.message) — message nào không phải key sẽ được trả nguyên văn,
 * nhờ vậy thông báo lỗi từ backend vẫn hiện đúng.
 */
export const auth = {
  // Đăng nhập
  loginTitle: "Chào mừng trở lại",
  loginSubtitle: "Đăng nhập để tiếp tục quản lý vườn cây của bạn",
  loginButton: "Đăng nhập",
  loginFailed: "Đăng nhập thất bại. Vui lòng thử lại sau.",
  registrationSuccess: "Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.",

  // Đăng ký
  registerTitle: "Tạo tài khoản mới",
  registerSubtitle: "Bắt đầu hành trình quản lý vườn cây thông minh",
  registerButton: "Tạo tài khoản",
  registerFailed: "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.",

  // Trường nhập liệu
  email: "Email",
  emailPlaceholder: "name@example.com",
  password: "Mật khẩu",
  confirmPassword: "Xác nhận mật khẩu",
  newPassword: "Mật khẩu mới",
  fullName: "Họ và tên",
  fullNamePlaceholder: "Nguyễn Văn A",
  forgotPasswordLink: "Quên mật khẩu?",

  // Yêu cầu mật khẩu
  passwordRequirements: "Yêu cầu mật khẩu:",
  ruleMinLength: "Ít nhất 8 ký tự",
  ruleUpperCase: "Chứa chữ in hoa",
  ruleLowerCase: "Chứa chữ thường",
  ruleNumber: "Chứa số",
  ruleSpecialChar: "Chứa ký tự đặc biệt",

  // Điều khoản
  agreePrefix: "Tôi đồng ý với",
  termsOfService: "Điều khoản dịch vụ",
  and: "và",
  privacyPolicy: "Chính sách bảo mật",

  // Đăng nhập mạng xã hội
  orContinueWith: "Hoặc đăng ký bằng",
  google: "Google",
  facebook: "Facebook",

  // Chuyển qua lại
  noAccount: "Chưa có tài khoản?",
  registerNow: "Đăng ký ngay",
  haveAccount: "Đã có tài khoản?",

  // Quên mật khẩu
  forgotTitle: "Quên mật khẩu",
  forgotSubtitle:
    "Nhập email đã đăng ký, chúng tôi sẽ gửi liên kết đặt lại mật khẩu cho bạn",
  forgotButton: "Gửi liên kết đặt lại",
  forgotSent:
    "Nếu email tồn tại trong hệ thống, liên kết đặt lại mật khẩu đã được gửi đi.",
  backToLogin: "Quay lại đăng nhập",

  // Luồng quên mật khẩu 4 bước (email → OTP → mật khẩu mới → xong)
  forgotFlow: {
    step1Title: "Quên mật khẩu?",
    step1Subtitle: "Nhập email của bạn để nhận mã OTP 6 số",
    step1Button: "Gửi mã xác nhận",
    step1Failed: "Không thể gửi email. Vui lòng thử lại.",

    step2Title: "Nhập mã xác nhận",
    step2Subtitle: "Mã xác nhận đã được gửi đến {email}",
    step2Label: "Mã OTP (6 chữ số)",
    step2Hint: "* Mã OTP có hiệu lực trong 60 giây",
    step2Button: "Xác nhận OTP",
    step2Checking: "Đang kiểm tra...",
    step2Failed: "Mã OTP không hợp lệ hoặc đã hết hạn.",

    step3Title: "Tạo mật khẩu mới",
    step3Subtitle: "Vui lòng đặt mật khẩu mạnh để bảo vệ tài khoản",
    step3Button: "Đổi mật khẩu",
    step3Updating: "Đang cập nhật...",
    step3Failed: "Đổi mật khẩu thất bại. Phiên có thể đã hết hạn.",

    step4Title: "Thành công!",
    step4Subtitle: "Tài khoản của bạn đã được cập nhật mật khẩu mới",
    step4Button: "Đăng nhập ngay bằng mật khẩu mới",
  },

  // Đặt lại / tạo mật khẩu
  resetTitle: "Đặt lại mật khẩu",
  resetSubtitle: "Nhập mật khẩu mới cho tài khoản của bạn",
  resetButton: "Đặt lại mật khẩu",
  resetSuccess: "Đổi mật khẩu thành công! Đang chuyển tới trang đăng nhập...",
  setPasswordTitle: "Tạo mật khẩu",
  setPasswordSubtitle:
    "Tài khoản của bạn đăng nhập bằng mạng xã hội. Tạo mật khẩu để đăng nhập trực tiếp.",
  setPasswordButton: "Tạo mật khẩu",

  // OTP
  otpTitle: "Xác thực email",
  otpSubtitle: "Chúng tôi đã gửi mã 6 chữ số tới {email}",
  otpLabel: "Mã xác thực",
  otpButton: "Xác thực",
  otpResend: "Gửi lại mã",
  otpResendIn: "Gửi lại mã sau {seconds}s",
  otpResent: "Đã gửi lại mã xác thực",
  otpFailed: "Mã OTP không hợp lệ hoặc đã hết hạn.",
  otpChangeEmail: "Đổi email khác",
  otpSentTo: "Nhập mã OTP 6 chữ số đã được gửi đến",
  otpVerifying: "Đang xác thực...",
  otpResendNew: "Gửi lại mã mới",
  otpResendFailed: "Không thể gửi lại mã. Thử lại sau.",
  otpResentMessage: "Mã OTP mới đã được gửi đến email của bạn.",

  // OAuth callback
  callbackProcessing: "Đang hoàn tất đăng nhập...",
  callbackFailed: "Đăng nhập thất bại. Vui lòng thử lại.",
  callbackSyncing: "Đang đồng bộ tài khoản...",
  callbackWait: "Vui lòng chờ trong giây lát",

  // Thông báo lỗi của zod — dùng làm key, không hiển thị trực tiếp
  validation: {
    emailRequired: "Email không được để trống",
    emailInvalid: "Email không hợp lệ",
    passwordMin6: "Mật khẩu phải có ít nhất 6 ký tự",
    passwordMin8: "Mật khẩu phải có ít nhất 8 ký tự",
    passwordUpperCase: "Mật khẩu phải chứa ít nhất 1 chữ hoa",
    passwordLowerCase: "Mật khẩu phải chứa ít nhất 1 chữ thường",
    passwordNumber: "Mật khẩu phải chứa ít nhất 1 số",
    passwordSpecialChar: "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt",
    passwordMismatch: "Mật khẩu xác nhận không khớp",
    fullNameMin: "Họ tên phải có ít nhất 2 ký tự",
    fullNameMax: "Họ tên không được quá 50 ký tự",
    fullNameLetters: "Họ tên chỉ được chứa chữ cái và khoảng trắng",
    termsRequired: "Bạn phải đồng ý với Điều khoản và Chính sách bảo mật",
    otpLength: "Mã OTP phải có đúng 6 chữ số",
    otpDigits: "Mã OTP chỉ gồm 6 chữ số",
    tokenInvalid: "Token không hợp lệ",
  },
} as const;
