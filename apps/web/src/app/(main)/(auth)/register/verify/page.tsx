import { Suspense } from "react";
import RegisterOtpForm from "@/components/auth/RegisterOtpForm";

export default function RegisterVerifyPage() {
  return (
    <div className="pt-24">
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center text-gray-400">
            Đang tải trang xác thực...
          </div>
        }
      >
        <RegisterOtpForm />
      </Suspense>
    </div>
  );
}
