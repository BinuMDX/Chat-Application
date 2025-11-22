'use client';

interface Message {
  id: number;
  text: string;
  senderId: number;
  conversationId: string;
  createdAt: string;
}

interface MessageListProps {
  messages: Message[];
  isConnected: boolean;
  currentUserId?: number;
}

export default function MessageList({ messages, isConnected, currentUserId }: MessageListProps) {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {!isConnected && (
        <div className="text-center text-gray-500 mb-4">
          Connecting to chat...
        </div>
      )}

      {messages.length === 0 && isConnected && (
        <div className="text-center text-gray-400 mt-8">
          No messages yet. Start the conversation!
        </div>
      )}

      {messages.map((m: Message, idx: number) => {
        const isSent = m.senderId === currentUserId;

        return (
          <div key={idx} className={`mb-3 flex ${isSent ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-[70%]">
              <div className={`p-3 rounded-lg shadow-sm ${isSent
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-white text-gray-800 rounded-bl-none'
                }`}>
                <div className="break-words">{m.text}</div>
              </div>
              <div className={`text-xs text-gray-400 mt-1 px-1 ${isSent ? 'text-right' : 'text-left'}`}>
                {formatTime(m.createdAt)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
