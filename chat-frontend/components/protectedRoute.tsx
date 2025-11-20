"use client";

import { useAuthStore } from "@/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const token = useAuthStore((s) => s.accessToken);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  useEffect(() => {
    // Only redirect after hydration is complete and there's no token
    if (hasHydrated && !token) {
      router.replace("/auth/login");
    }
  }, [token, hasHydrated, router]);

  // Show loading/nothing until hydrated
  if (!hasHydrated) return null;
  
  // Show nothing if no token after hydration
  if (!token) return null;
  
  return <>{children}</>;
}
