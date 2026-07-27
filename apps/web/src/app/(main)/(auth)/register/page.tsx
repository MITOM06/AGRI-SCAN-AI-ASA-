import { Suspense } from "react";
import RegisterForm from "@/components/auth/RegisterForm";
import { LoadingFallback } from "@/components/common";

export default function RegisterPage() {
  return (
    <div className="pt-24">
      <Suspense
        fallback={<LoadingFallback messageKey="common.loadingRegisterForm" />}
      >
        <RegisterForm />
      </Suspense>
    </div>
  );
}
