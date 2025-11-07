import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const ChatBox = () => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const user_id = localStorage.getItem("user_id"); // your logged-in user id

    const newSocket = io("http://localhost:5000", {
      query: { user_id },
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to Socket.IO as user:", user_id);
    });

    newSocket.on("receive_message", (data) => {
      console.log("Received message:", data);
      setMessages((prev) => [...prev, data]);
    });

    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    if (!socket) {
      setError("Real-time chat is currently unavailable. Messages will be saved locally only.");
    }
    
    const savedMessages = localStorage.getItem(`chat_${localStorage.getItem("user_id")}_${receiverId}`);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, [receiverId, socket]);

  const sendMessage = () => {
    if (socket && receiverId && message) {
      const sender_id = localStorage.getItem("user_id");

      const msg = {
        sender_id,
        receiver_id: receiverId,
        content: message,
        timestamp: new Date().toISOString(),
      };

      socket.emit("send_message", msg);
      setMessages((prev) => [...prev, msg]);
      setMessage("");
    }
  };

  return (
    <div style={styles.container}>
      <h2>💬 Live Chat</h2>

      <div style={styles.chatWindow}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.message,
              alignSelf:
                msg.sender_id === localStorage.getItem("user_id")
                  ? "flex-end"
                  : "flex-start",
              backgroundColor:
                msg.sender_id === localStorage.getItem("user_id")
                  ? "#DCF8C6"
                  : "#FFF",
            }}
          >
            <strong>{msg.sender_id}:</strong> {msg.content}
          </div>
        ))}
      </div>

      <div style={styles.controls}>
        <input
          type="text"
          placeholder="Enter receiver ID"
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Type message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.button}>
          Send
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: "400px",
    margin: "20px auto",
    padding: "15px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
  },
  chatWindow: {
    display: "flex",
    flexDirection: "column",
    height: "300px",
    overflowY: "auto",
    padding: "10px",
    border: "1px solid #ddd",
    marginBottom: "10px",
    backgroundColor: "#fff",
  },
  message: {
    margin: "5px",
    padding: "8px 12px",
    borderRadius: "10px",
    maxWidth: "80%",
  },
  controls: {
    display: "flex",
    gap: "8px",
  },
  input: {
    flex: 1,
    padding: "8px",
  },
  button: {
    padding: "8px 12px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default ChatBox;
