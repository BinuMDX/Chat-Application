'use client';

import { useUIStore } from "@/store/useUIStore";
import UserList from "./UserList";
import { useAuthStore } from "@/features/auth/store";

export default function Sidebar() {
  const user = useAuthStore((s) => s.user);
  const { isSidebarOpen, closeSidebar } = useUIStore();

  return (
     <>
    <div
        onClick={closeSidebar}
        className={`fixed inset-0 bg-black/40 z-30 lg:hidden transition-opacity ${
          isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />


     <div
        className={`
          fixed z-40 top-0 left-0 h-full bg-white shadow-md
          w-64 transition-transform 
          lg:static lg:translate-x-0 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >

    <div className="w-64 bg-white border-r flex flex-col">
      <div className="p-4 border-b">
        <h1 className="font-bold text-xl">Chats</h1>
      </div>
      <div className="flex-1 overflow-y-auto">
        <UserList />
      </div>

      {/* Current User Display */}
      <div className="p-4 border-t bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate">
              {user?.username || 'User'}
            </p>
            <p className="text-xs text-gray-500">Online</p>
          </div>
        </div>
      </div>
    </div>
    </div>

    </>
  );
}
