interface ChatHeaderProps {
  chat: {
    id: string;
    title?: string;
    // Add other properties as needed based on your Conversation type
  };
}

export default function ChatHeader({ chat }: ChatHeaderProps) {
  return (
    <div className="p-4 bg-white border-b flex items-center">
      <h2 className="font-semibold text-lg">{chat.title || 'Chat'}</h2>
    </div>
  );
}
