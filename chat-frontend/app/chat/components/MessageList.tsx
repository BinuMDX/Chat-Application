export default function MessageList() {
  const messages = [
    { id: 1, text: "Hi, how are you?", sender: "me" },
    { id: 2, text: "I'm fine! Working on the chat app.", sender: "them" },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`p-3 rounded-lg max-w-[60%] ${
            msg.sender === "me"
              ? "bg-blue-500 text-white ml-auto"
              : "bg-gray-200 text-black"
          }`}
        >
          {msg.text}
        </div>
      ))}
    </div>
  );
}
