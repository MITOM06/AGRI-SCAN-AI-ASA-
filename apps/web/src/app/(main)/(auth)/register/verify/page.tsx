import { Suspense } from "react";
import RegisterOtpForm from "@/components/auth/RegisterOtpForm";
import { LoadingFallback } from "@/components/common";

export default function RegisterVerifyPage() {
  return (
    <div className="pt-24">
      <Suspense
        fallback={<LoadingFallback messageKey="common.loadingVerifyPage" />}
      >
        <RegisterOtpForm />
      </Suspense>
    </div>
  );
}
