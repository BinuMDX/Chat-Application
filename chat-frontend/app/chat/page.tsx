"use client"

import Sidebar from "./components/Sidebar";
import { useAuthStore } from "@/features/auth/store";
import { useChatStore } from "@/features/chat/store";

export default function ChatPage() {
  const user = useAuthStore((s) => s.user);
  const { chats } = useChatStore();

  return (
    <div className="flex w-full h-screen">
      <Sidebar />

      <div className="flex flex-col flex-1 bg-gray-100">
        {/* Default conversation room - shown when no conversation is selected */}
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center p-8">
            <div className="mb-4">
              <svg
                className="w-24 h-24 mx-auto text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
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
