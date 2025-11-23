"use client";

import { useAuthStore } from "@/features/auth/store";
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
    if (hasHydrated && !token) {
      router.replace("/auth/login");
    }
  }, [token, hasHydrated, router]);

  if (!hasHydrated) return <div>Loading…</div>;
  
  if (!token) return null;
  
  return <>{children}</>;
}
