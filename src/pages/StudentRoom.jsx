import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const BACKEND_URL = "http://192.168.1.3:3001";

export default function StudentRoom() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const socketRef = useRef(null);

  const [count, setCount] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const socket = io(BACKEND_URL);
    socketRef.current = socket;

    console.log("Student joining room:", roomCode);

    socket.emit("join-room", {
      roomCode,
      role: "student",
    });

    socket.on("room-count", (num) => {
      setCount(num);
    });

    socket.on("join-denied", () => {
      setError("Quiz already started. You cannot join.");
    });

    // 🔥 THIS IS THE KEY PART
    socket.on("quiz-started", () => {
      console.log("Quiz started event received");
      navigate(`/quiz/${roomCode}`);
    });

    return () => socket.disconnect();
  }, [roomCode, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 text-lg font-semibold">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-3">
          Joined Room {roomCode}
        </h1>

        <p className="text-lg mb-2">
          Students Joined: <b>{count}</b>
        </p>

        <p className="text-gray-500">
          Waiting for teacher to start the quiz…
        </p>
      </div>
    </div>
  );
}
