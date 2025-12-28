import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

// 📊 Charts
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function TeacherRoom() {
  const { roomCode } = useParams();

  const [count, setCount] = useState(0);
  const [answerStats, setAnswerStats] = useState({});

  // 🔑 Single socket instance
  const socketRef = useRef(null);
  console.log("Teacher roomCode:", roomCode);

  /* ===============================
     SOCKET CONNECTION
     =============================== */
  useEffect(() => {
    const socket = io("http://192.168.1.3:3001");
    socketRef.current = socket;

    socket.emit("join-room", {
      roomCode,
      role: "teacher",
    });

    socket.on("room-count", setCount);

    socket.on("answer-stats", ({ stats }) => {
      setAnswerStats(stats);
    });

    return () => socket.disconnect();
  }, [roomCode]);

  /* ===============================
     START QUIZ
     =============================== */
  const startQuiz = () => {
    console.log("Teacher starting quiz:", roomCode);
    socketRef.current.emit("start-quiz", roomCode);
  };

  /* ===============================
     CHART DATA
     =============================== */
  const chartData = Object.entries(answerStats).map(
    ([optionIndex, count]) => ({
      option: `Option ${Number(optionIndex) + 1}`,
      count,
    })
  );

  /* ===============================
     UI
     =============================== */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg text-center">
        <h1 className="text-2xl font-bold mb-2">
          Room {roomCode}
        </h1>

        <p className="text-lg mb-4">
          Students Joined: <b>{count}</b>
        </p>

        <button
          onClick={startQuiz}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg w-full mb-6"
        >
          Start Quiz
        </button>

        {/* 📊 LIVE ANSWER CHART */}
        {chartData.length > 0 && (
          <>
            <h2 className="text-lg font-semibold mb-2">
              Live Answer Distribution
            </h2>

            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="option" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
