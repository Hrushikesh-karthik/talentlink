import React, { useEffect, useState } from "react";
import { socket } from "../socket";

function MessagePage() {
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

    if (storedUser) {
      try {
        socket.emit("join", { room: `user_${storedUser.id}` });
        console.log(`✅ Joined room user_${storedUser.id}`);
      } catch (err) {
        console.error("Error joining socket room:", err);
        setError("Could not connect to the messaging service. Some features may be limited.");
      }
    }

    const handleMessage = (data) => {
      console.log("📩 Received message:", data);
      setMessages((prev) => [...prev, data]);
    };

    socket?.on("receive_message", handleMessage);

    // Cleanup
    return () => {
      socket?.off("receive_message", handleMessage);
    };

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
          💬 Live Chat
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
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
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
                      ? "bg-blue-500 text-white"
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

export default MessagePage;
// // src/pages/client/ClientMessagePage.jsx
// import React, { useEffect, useState } from "react";
// import socket from "../socket";

// function ClientMessagePage() {
//   const [message, setMessage] = useState("");
//   const [receiverId, setReceiverId] = useState("");
//   const [messages, setMessages] = useState([]);

//   const storedUser = JSON.parse(localStorage.getItem("user"));

//   useEffect(() => {
//     if (storedUser) {
//       socket.emit("join", { room: `user_${storedUser.id}` });
//       console.log(`✅ Client joined room user_${storedUser.id}`);
//     }

//     socket.on("receive_message", (data) => {
//       setMessages((prev) => [...prev, data]);
//     });

//     return () => socket.off("receive_message");
//   }, []);

//   const sendMessage = () => {
//     if (!receiverId || !message.trim()) return alert("Enter receiver ID!");

//     const data = {
//       sender_id: storedUser.id,
//       receiver_id: receiverId,
//       content: message,
//       room: `user_${receiverId}`,
//     };

//     socket.emit("send_message", data);
//     setMessages((prev) => [...prev, data]);
//     setMessage("");
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-6">
//       <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
//         <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
//           💬 Client Chat
//         </h2>

//         <div className="flex gap-2 mb-4">
//           <input
//             type="text"
//             placeholder="Receiver ID"
//             value={receiverId}
//             onChange={(e) => setReceiverId(e.target.value)}
//             className="border border-gray-300 p-2 rounded w-1/4 text-gray-800"
//           />
//           <input
//             type="text"
//             placeholder="Type a message..."
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             className="border border-gray-300 p-2 rounded flex-1 text-gray-800"
//           />
//           <button
//             onClick={sendMessage}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
//           >
//             Send
//           </button>
//         </div>

//         <div className="border border-gray-200 rounded-lg p-4 h-80 overflow-y-auto bg-gray-50">
//           {messages.length === 0 ? (
//             <p className="text-center text-gray-500">No messages yet.</p>
//           ) : (
//             messages.map((msg, i) => (
//               <div
//                 key={i}
//                 className={`mb-3 flex ${
//                   msg.sender_id === storedUser?.id
//                     ? "justify-end"
//                     : "justify-start"
//                 }`}
//               >
//                 <div
//                   className={`px-3 py-2 rounded-lg text-sm max-w-xs ${
//                     msg.sender_id === storedUser?.id
//                       ? "bg-blue-500 text-white"
//                       : "bg-gray-200 text-gray-900"
//                   }`}
//                 >
//                   {msg.content}
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ClientMessagePage;
