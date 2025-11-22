"use client";

import { useState } from "react";

export default function MessageInput({ onSend }: { onSend: (msg: string) => void }) {
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    if (!message.trim()) return;
    onSend(message.trim());
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="p-4 bg-white border-t flex gap-3">
      <input
        className="flex-1 p-2 border rounded-md"
        placeholder="Type a message..."
        value={message}
        onChange={e => setMessage(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded-md"
        onClick={sendMessage}
      >
        Send
      </button>
    </div>
  );
}
