"use client"

import Sidebar from "./components/Sidebar";
import { useAuthStore } from "@/features/auth/store";
import { useChatStore } from "@/features/chat/store";
import { useUIStore } from "@/store/useUIStore";
import { Menu } from "lucide-react";

export default function ChatPage() {
  const user = useAuthStore((s) => s.user);
  const { chats } = useChatStore();

  const { toggleSidebar } = useUIStore();

  return (
    <div className="flex w-full h-screen overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 bg-gray-100">
        <div className="p-4 bg-white border-b flex items-center">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 mr-3 rounded-md hover:bg-gray-200"
          >
            <Menu size={22} />
          </button>
          <h1 className="font-bold text-xl">Chats</h1>
        </div>

        <div className="flex flex-1 items-start justify-center pt-16">
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
