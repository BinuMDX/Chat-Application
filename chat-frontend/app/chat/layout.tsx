import ProtectedRoute from "@/components/protectedRoute";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
     <ProtectedRoute>
    <div className="h-screen w-full flex overflow-hidden">
      {children}
    </div>
    </ProtectedRoute>
  );
}
