"use client"

import ProtectedRoute from "@/components/protectedRoute";
import ChatHeader from "./components/ChatHeader";
import MessageInput from "./components/MessageInput";
import MessageList from "./components/MessageList";
import Sidebar from "./components/Sidebar";
import { useEffect, useState } from "react";
import { useSocket } from "@/hooks/useSocket";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/features/auth/store";

export default function ChatPage() {
  const token = useAuthStore((s) => s.accessToken);
  const params = useParams();
  const [messages, setMessages] = useState<any[]>([]);

  const { isConnected, joinRoom, sendMessage } = useSocket({
    token,
    onMessage: (msg) => {
      setMessages((prev) => [...prev, msg]);
    },
    onConnect: () => console.log("Connected to socket"),
    onError: (err) => console.log("Socket error:", err),
  });

  const conversationId = params.conversationId as string;;

  useEffect(() => {
    if (token) {
      joinRoom(conversationId);
    }
  }, [token]);

  const handleSend = async (content: string) => {
    sendMessage(conversationId, content);
  };

  return (
    <div className="flex w-full h-full">
      <Sidebar />

      <div className="flex flex-col flex-1 bg-gray-100">
        <ChatHeader />

        <MessageList messages={messages}
          isConnected={isConnected} />

        <MessageInput onSend={handleSend} />
      </div>
    </div>
  );
}
