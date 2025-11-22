"use client"

import Sidebar from "./components/Sidebar";
import { useAuthStore } from "@/features/auth/store";
import { useChatStore } from "@/features/chat/store";

export default function ChatPage() {
  const user = useAuthStore((s) => s.user);
  const { chats } = useChatStore();

  return (
    <div className="flex w-full h-screen overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 bg-gray-100">
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center p-8">
         
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Welcome, {user?.username || "User"}!
            </h2>
            <p className="text-gray-500 mb-6">
              Select a conversation from the sidebar to start chatting
            </p>
            {chats.length === 0 && (
              <p className="text-sm text-gray-400">
                Or start a new conversation by clicking on a user
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
