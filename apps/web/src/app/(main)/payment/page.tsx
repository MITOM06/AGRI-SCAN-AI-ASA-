import { Suspense } from "react";
import { Payment } from "@/components/billing/Payment";
import { LoadingFallback } from "@/components/common";

export default function PaymentPage() {
  return (
    <div className="pt-24">
      <Suspense fallback={<LoadingFallback />}>
        <Payment />
      </Suspense>
    </div>
  );
}
