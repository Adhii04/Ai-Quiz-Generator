import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../config.js";

export default function CreateRoom() {
  const navigate = useNavigate();

  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [quizGenerated, setQuizGenerated] = useState(false);
  const [loading, setLoading] = useState(false);

  // ===============================
  // GENERATE QUIZ (AI)
  // ===============================
  const generateQuizAI = async () => {
    if (!topic.trim()) {
      alert("Please enter a topic");
      return;
    }

    try {
      setLoading(true);

      console.log("➡ Calling:", `${API_BASE}/api/generate-quiz`);

      const res = await fetch(`${API_BASE}/api/generate-quiz`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic,
          difficulty,
          count: 5,
        }),
      });

      console.log("⬅ Status:", res.status);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      console.log("⬅ Response:", data);

      if (data.success) {
        setQuizGenerated(true);
        alert("Quiz generated successfully!");
      } else {
        alert("Quiz generation failed");
      }
    } catch (err) {
      console.error("❌ Backend error:", err);
      alert("Backend not reachable");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // CREATE ROOM
  // ===============================
  const createRoom = async () => {
    try {
      console.log("➡ Creating room:", `${API_BASE}/api/create-room`);

      const res = await fetch(`${API_BASE}/api/create-room`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Room creation failed");
      }

      const data = await res.json();
      navigate(`/teacher-room/${data.roomCode}`);
    } catch (err) {
      console.error("❌ Room error:", err);
      alert("Failed to create room");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Create Quiz Room
        </h1>

        <input
          type="text"
          placeholder="Enter quiz topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="border p-2 w-full mb-3 rounded"
        />

        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="border p-2 w-full mb-4 rounded"
        >
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>

        <button
          onClick={generateQuizAI}
          disabled={loading}
          className="bg-purple-600 text-white px-4 py-2 rounded w-full mb-3"
        >
          {loading ? "Generating..." : "Generate Quiz (AI)"}
        </button>

        <button
          onClick={createRoom}
          disabled={!quizGenerated}
          className={`px-4 py-2 rounded w-full ${
            quizGenerated
              ? "bg-blue-600 text-white"
              : "bg-gray-400 text-white"
          }`}
        >
          Create Room
        </button>
      </div>
    </div>
  );
}
