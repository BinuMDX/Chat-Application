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

    // Fetch messages for this conversation
    api
      .get(`/chat/messages/${conversationId}`)
      .then((res) => {
        setMessages(conversationId, res.data);
      })
      .catch(console.error);
  }, [conversationId, setMessages]);

  // Join socket room and handle room switching
  useEffect(() => {
    if (isConnected && conversationId) {
      console.log('Joining room:', conversationId);
      joinRoom(conversationId);

      // Cleanup: leave room when conversation changes or component unmounts
      return () => {
        console.log('Leaving room:', conversationId);
        // Note: leaveRoom is handled by socket cleanup
      };
    }
  }, [isConnected, conversationId, joinRoom]);

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
