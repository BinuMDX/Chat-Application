import ProtectedRoute from "@/components/protectedRoute";
import ChatHeader from "./components/ChatHeader";
import MessageInput from "./components/MessageInput";
import MessageList from "./components/MessageList";
import Sidebar from "./components/Sidebar";

export default function ChatPage() {
  return (
    
    <div className="flex w-full h-full">
      <Sidebar />

      <div className="flex flex-col flex-1 bg-gray-100">
        <ChatHeader />

        <MessageList />

        <MessageInput />
      </div>
    </div>

  );
}
