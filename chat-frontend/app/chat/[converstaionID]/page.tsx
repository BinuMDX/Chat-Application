"use client";

import Sidebar from "../components/Sidebar";
import ChatHeader from "../components/ChatHeader";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";

import { useSocket } from "@/hooks/useSocket";
import { useAuthStore } from "@/features/auth/store";
import { useChatStore } from "@/features/chat/store";

import api from "@/lib/axios";
import { useEffect } from "react";
import { useParams } from "next/navigation";

export default function ChatPage() {
  const params = useParams();
  const conversationId = params.conversationId as string;

  const token = useAuthStore((s) => s.accessToken);

  const { activeChat, setActiveChat, setMessages, addMessage } = useChatStore();

  const { isConnected, joinRoom, sendMessage } = useSocket({
    token,
    onMessage: (msg) => {
      addMessage(msg); // update store
    },
  });

  // Load messages + conversation details
  useEffect(() => {
    if (!conversationId) return;

    api
      .get(`/chat/conversation/${conversationId}`)
      .then((res) => {
        setActiveChat(res.data.conversation);
        setMessages(conversationId, res.data.messages);
      })
      .catch(console.error);
  }, [conversationId]);

  // Join socket room
  useEffect(() => {
    if (isConnected && conversationId) {
      joinRoom(conversationId);
    }
  }, [isConnected, conversationId]);

  const handleSend = (text: string) => {
    sendMessage(conversationId, text);
  };

  if (!activeChat) {
    return (
      <div className="flex h-full">
        <Sidebar />
        <div className="flex flex-1 items-center justify-center">
          Loading chat...
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <ChatHeader chat={activeChat} />

        <MessageList messages={activeChat.messages || []} />

        <MessageInput onSend={handleSend} />
      </div>
    </div>
  );
}
