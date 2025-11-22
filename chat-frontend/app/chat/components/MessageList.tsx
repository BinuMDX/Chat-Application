'use client';

export default function MessageList({ messages, isConnected }: any) {
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

      {messages.map((m: any, idx: number) => (
        <div key={idx} className="mb-3">
          <div className="p-2 bg-white rounded shadow-sm inline-block">
            {m.text}
          </div>
        </div>
      ))}
    </div>
  );
}
