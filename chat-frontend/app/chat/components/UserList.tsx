"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useChatStore } from "@/features/chat/store";
import { useAuthStore } from "@/features/auth/store";
import { useRouter } from "next/navigation";

export default function UserList() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { activeChat, setActiveChat } = useChatStore();

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  const openChat = async (otherUserId: number) => {
    const res = await api.post("/chat/create-or-get", {
      userId: otherUserId,
    });

    const conversationId = res.data.id;

    router.push(`/chat/${conversationId}`);
  };

  if (loading) return <div className="p-4">Loading users…</div>;

  return (
    <div className="w-64 bg-white border-r p-4">

      <ul className="space-y-2">
        {users
          .filter((u) => u.id !== user?.id) // hide yourself
          .map((u) => (
            <li
              key={u.id}
              onClick={() => {setActiveChat(u); openChat(u.id);}}
              className={`p-3 cursor-pointer rounded-lg 
                ${activeChat?.id === u.id ? "bg-blue-500 text-white" : "bg-gray-100"}
              `}
            >
              {u.username}
            </li>
          ))}
      </ul>
    </div>
  );
}
