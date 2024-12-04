import { useState } from "react";

export const ChatInput = ({
  message,
}: {
  message: { type: "user" | "bot"; content: string };
}) => {
  return (
    <div
      className={`flex ${
        message.type === "user" ? "justify-end" : "justify-start"
      } mb-4`}
    >
      <div
        className={`max-w-md p-3 rounded-lg ${
          message.type === "user"
            ? "bg-blue-500 text-white"
            : "bg-gray-300 text-black"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
};

export const MessageInput = ({
  value,
  onChange,
  onSend,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
}) => {
  return (
    <div className="flex w-full">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Type a message..."
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
      />
      <button
        onClick={onSend}
        className="ml-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Send
      </button>
    </div>
  );
};

export const TextInputComponent = () => {
  const [messages, setMessages] = useState<
    { type: "user" | "bot"; content: string }[]
  >([]);
  const [currentInput, setCurrentInput] = useState("");

  const handleSend = () => {
    if (currentInput.trim()) {
      setMessages((prev) => [...prev, { type: "user", content: currentInput }]);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { type: "user", content: currentInput },
          { type: "bot", content: "This is a sample response." },
        ]);
      }, 1000);
      setCurrentInput("");
    }
  };

  return (
    <div className="flex flex-col w-full h-full">
      {/* Chat window */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <ChatInput key={index} message={message} />
        ))}
      </div>

      {/* Message Input */}
      <div className="flex p-4 border-t border-gray-300">
        <MessageInput
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onSend={handleSend}
        />
      </div>
    </div>
  );
};
