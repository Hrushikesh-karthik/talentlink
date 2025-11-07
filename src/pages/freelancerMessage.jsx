import React, { useState, useEffect } from "react";
import { socket } from "../socket";

function FreelancerMessagePage() {
  const [message, setMessage] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const storedUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!socket) {
      setError("Real-time messaging is currently unavailable. Please refresh the page to check for new messages.");
      return;
    }

    if (currentUser) {
      try {
        socket.emit("join", { room: `user_${currentUser.id}` });
        console.log(`Freelancer joined room: user_${currentUser.id}`);
      } catch (err) {
        console.error("Error joining socket room:", err);
        setError("Could not connect to the messaging service. Some features may be limited.");
      }
    }

    socket.on("receive_message", (data) => {
      console.log("📩 Freelancer received message:", data);
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  const sendMessage = () => {
    if (!receiverId || !message.trim()) {
      alert("Enter receiver ID and a message!");
      return;
    }

    const data = {
      sender_id: storedUser.id,
      receiver_id: receiverId,
      content: message,
      room: `user_${receiverId}`,
    };

    socket.emit("send_message", data);
    setMessages((prev) => [...prev, data]);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-6">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          💬 Freelancer Chat
        </h2>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Receiver ID"
            value={receiverId}
            onChange={(e) => setReceiverId(e.target.value)}
            className="border border-gray-300 p-2 rounded w-1/4 text-gray-800"
          />
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="border border-gray-300 p-2 rounded flex-1 text-gray-800"
          />
          <button
            onClick={sendMessage}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Send
          </button>
        </div>

        <div className="border border-gray-200 rounded-lg p-4 h-80 overflow-y-auto bg-gray-50">
          {messages.length === 0 ? (
            <p className="text-center text-gray-500">No messages yet.</p>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                className={`mb-3 flex ${
                  msg.sender_id === storedUser?.id
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`px-3 py-2 rounded-lg text-sm max-w-xs ${
                    msg.sender_id === storedUser?.id
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-900"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default FreelancerMessagePage;
