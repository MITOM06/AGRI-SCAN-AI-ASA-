import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm'
import { LoadingFallback } from "@/components/common";
import { Suspense } from "react";

export default function ForgotPasswordPage() {
  return (
    <div className="pt-24">
      <Suspense
        fallback={
          <LoadingFallback messageKey="common.loadingForgotPasswordForm" />
        }
      >
        <ForgotPasswordForm />
      </Suspense>
    </div>
  );
}
