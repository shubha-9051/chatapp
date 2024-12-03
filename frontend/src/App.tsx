import { useEffect, useState, useRef } from 'react';
import { FiSend } from 'react-icons/fi';
import './App.css';

function App() {
  const [messages, setMessages] = useState(["hi", "hello"]);
  const [roomID, setRoomID] = useState("");
  const [joined, setJoined] = useState(false);
  const wsRef = useRef();

  useEffect(() => {
    if (joined) {
      const ws = new WebSocket("ws://localhost:8080");
      ws.onmessage = (event) => {
        setMessages(m => [...m, event.data]);
      };
      ws.onopen = () => {
        ws.send(JSON.stringify({
          type: "join",
          payload: {
            roomID: roomID
          }
        }));
      };
      wsRef.current = ws;
    }
  }, [joined, roomID]);

  const handleJoinRoom = () => {
    if (roomID.trim() !== "") {
      setJoined(true);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white font-roboto">
      {!joined ? (
        <div className="flex flex-col items-center justify-center h-full">
          <input
            type="text"
            value={roomID}
            onChange={(e) => setRoomID(e.target.value)}
            className="p-2 mb-4 bg-gray-700 text-white rounded"
            placeholder="Enter Room ID"
          />
          <button
            onClick={handleJoinRoom}
            className="p-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            Join Room
          </button>
        </div>
      ) : (
        <>
          <div className="flex-grow p-4 overflow-y-auto">
            {messages.map((message, index) => (
              <div key={index} className="mb-2 p-2 bg-gray-800 rounded">
                {message}
              </div>
            ))}
          </div>
          <div className="p-4 bg-gray-800 flex items-center">
            <input
              type="text"
              id="message"
              className="flex-grow p-2 mr-2 bg-gray-700 text-white rounded"
              placeholder="Type your message..."
            />
            <button
              onClick={() => {
                const message = document.getElementById("message")?.value;
                wsRef.current.send(JSON.stringify({
                  type: "chat",
                  payload: {
                    message: message
                  }
                }));
                document.getElementById("message").value = '';
              }}
              className="p-2 bg-blue-600 rounded hover:bg-blue-700 flex items-center justify-center"
            >
              <FiSend size={24} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;