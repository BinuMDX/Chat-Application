"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useAuthStore } from "@/features/auth/store";
import { useChatStore } from "@/features/chat/store";
import { useSocket } from "@/hooks/useSocket";

interface User {
  id: number;
  username: string;
}

export default function UserList() {

  const token = useAuthStore((s) => s.accessToken);
  const { user: currentUser, hasHydrated } = useAuthStore();

  const setActiveChat = useChatStore((s) => s.setActiveChat);

  const [users, setUsers] = useState<User[]>([]);

  // Initialize socket
  useSocket({ token });

  // Load all users from database
  useEffect(() => {
    api.get("/user")
      .then((res) => setUsers(res.data))
      .catch(console.error);
  }, []);

  // Click → start chat or open existing conversation
  const openChat = async (otherUserId: number) => {
    const res = await api.post("/chat/create-or-get", { userId: otherUserId });

    setActiveChat(res.data);  // conversation object
  };

  if (!hasHydrated) {
  return <div>Loading...</div>;
  }

  return (
    <div className="border-r w-64 h-full overflow-y-auto bg-white">
      <h2 className="text-lg font-semibold p-4 border-b">Users</h2>

      {users
        .filter(u => u.id !== currentUser.id)
        .map((user) => (
          <div
            key={user.id}
            onClick={() => openChat(user.id)}
            className="p-3 border-b cursor-pointer hover:bg-gray-100"
          >
            <div className="font-semibold">{user.username}</div>
          </div>
        ))}
    </div>
  );
}
