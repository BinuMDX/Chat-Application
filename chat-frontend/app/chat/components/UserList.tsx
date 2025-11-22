"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useChatStore } from "@/features/chat/store";
import { useAuthStore } from "@/features/auth/store";
import { useRouter, useParams } from "next/navigation";

export default function UserList() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuthStore();
  const { setActiveChat } = useChatStore();

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

  // Track current conversation from URL
  useEffect(() => {
    const convId = params.conversationId as string;
    setCurrentConversationId(convId || null);
  }, [params.conversationId]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await api.get("/user");
        setUsers(res.data);
      } catch (err) {
        console.error("Load users failed:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const openChat = async (otherUser: any) => {
    try {
      const res = await api.post("/chat/conversation", {
        receiverId: otherUser.id,
      });

      const conversation = res.data;
      setActiveChat(conversation);

      const conversationId = conversation.id;
      setCurrentConversationId(conversationId);

      router.push(`/chat/${conversationId}`);
    } catch (err) {
      console.error("Failed to open chat:", err);
    }
  };

  if (loading) return <div className="p-4">Loading users…</div>;

  return (
    <div className="p-4">
      <ul className="space-y-2">
        {users
          .filter((u) => u.id !== user?.id) // hide yourself
          .map((u) => (
            <li
              key={u.id}
              onClick={() => openChat(u)}
              className={`p-3 cursor-pointer rounded-lg transition-colors
                ${currentConversationId ? "bg-gray-100 hover:bg-gray-200" : "bg-gray-100 hover:bg-blue-50"}
              `}
            >
              <div className="font-medium">{u.username}</div>
              {u.email && <div className="text-sm text-gray-500">{u.email}</div>}
            </li>
          ))}
      </ul>
    </div>
  );
}
