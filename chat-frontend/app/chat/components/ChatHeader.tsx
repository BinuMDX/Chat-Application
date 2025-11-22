import { Menu } from "lucide-react";
import { useAuthStore } from "@/features/auth/store";
import { useUIStore } from "@/store/useUIStore";

interface Participant {
  userId: number;
  isSelf: boolean;
  user: {
    id: number;
    username: string;
  };
}

interface ChatHeaderProps {
  chat: {
    id: string;
    participants: Participant[];
  };
}

export default function ChatHeader({ chat }: ChatHeaderProps) {
  const currentUser = useAuthStore((s) => s.user);

  const { toggleSidebar } = useUIStore();

  // Find the receiver (the participant who is not the current user)
  const receiver = chat.participants.find(
    (participant) => participant.user.id !== currentUser?.id
  );

  const displayName = receiver?.user.username || 'Chat';

  return (

    <div className="p-4 bg-white border-b flex items-center">

      <button
        onClick={toggleSidebar}
        className="lg:hidden p-2 mr-3 rounded-md hover:bg-gray-200"
      >
        <Menu size={22} />
      </button>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
          {displayName.charAt(0).toUpperCase()}
        </div>

        <div>
          <h2 className="font-semibold text-lg">{displayName}</h2>
        </div>
      </div>
    </div>
  );
}
