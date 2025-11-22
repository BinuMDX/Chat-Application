'use client';

export default function MessageList({ messages, isConnected }: any) {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      {!isConnected && (
        <div className="text-center text-gray-500 mb-4">
          Connecting…
        </div>
      )}

      {messages.map((m: any, idx: number) => (
        <div key={idx} className="mb-3">
          <div className="p-2 bg-white rounded shadow-sm inline-block">
            {m.content}
          </div>
        </div>
      ))}
    </div>
  );
}
