import { UserProfile } from "@/components";
import { LoadingFallback } from "@/components/common";
import { Suspense } from "react";

export default function ProfilePage() {
  return (
    <div className="pt-24">
      <Suspense
        fallback={<LoadingFallback messageKey="common.loadingProfileForm" />}
      >
        <UserProfile />
      </Suspense>
    </div>
  );
}
