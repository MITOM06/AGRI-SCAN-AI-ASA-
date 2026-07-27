import LoginForm from "@/components/auth/LoginForm";
import { LoadingFallback } from "@/components/common";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <div className="pt-24">
      <Suspense fallback={<LoadingFallback messageKey="common.loadingLoginForm" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
