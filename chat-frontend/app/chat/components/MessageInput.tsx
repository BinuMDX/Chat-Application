"use client";

import { useState } from "react";

export default function MessageInput() {
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    if (!message.trim()) return;
    console.log("sending:", message);
    setMessage("");
  };

  return (
    <div className="p-4 bg-white border-t flex gap-3">
      <input
        className="flex-1 p-2 border rounded-md"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
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
