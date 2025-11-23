"use client";

import Sidebar from "../components/Sidebar";
import ChatHeader from "../components/ChatHeader";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";

import { useSocket } from "@/hooks/useSocket";
import { useAuthStore } from "@/features/auth/store";
import { useChatStore } from "@/features/chat/store";

import api from "@/lib/axios";
import { useEffect, useCallback } from "react";
import { useParams } from "next/navigation";

export default function ChatPage() {
  const params = useParams();
  const conversationId = params.conversationId as string;

  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.accessToken);

  const { activeChat, setActiveChat, setMessages, addMessage } = useChatStore();


  const handleMessage = useCallback((msg: any) => {
    console.log('Message received from socket:', msg);
    addMessage(msg);
  }, [addMessage]);

  const { isConnected, joinRoom, sendMessage } = useSocket({
    token,
    onMessage: handleMessage,
  });

  useEffect(() => {
    if (!conversationId) return;

    if (!activeChat || activeChat.id !== conversationId) {
      api
        .get(`/chat/conversations`)
        .then((res) => {
          const conversation = res.data.find((c: any) => c.id === conversationId);
          if (conversation) {
            setActiveChat(conversation);
          }
        })
        .catch(console.error);
    }

    api
      .get(`/chat/messages/${conversationId}`)
      .then((res) => {
        setMessages(conversationId, res.data);
      })
      .catch(console.error);
  }, [conversationId, setMessages, activeChat, setActiveChat]);

  useEffect(() => {
    if (isConnected && conversationId) {
      console.log('Joining room:', conversationId);
      joinRoom(conversationId);

      return () => {
        console.log('Leaving room:', conversationId);
      };
    }
  }, [isConnected, conversationId, joinRoom]);

  const handleSend = (text: string) => {
    if (!text.trim() || !user) return;

    const optimisticMessage = {
      id: Date.now(), 
      text,
      senderId: user.id,
      conversationId,
      createdAt: new Date().toISOString(),
    };

    addMessage(optimisticMessage);

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
    <div className="flex h-full w-full overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <ChatHeader chat={activeChat} />

        <MessageList
          messages={activeChat.messages || []}
          isConnected={isConnected}
          currentUserId={user?.id}
        />

        <MessageInput onSend={handleSend} />
      </div>
    </div>
  );
}
