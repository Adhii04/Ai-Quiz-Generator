import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StudentJoin() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const joinRoom = () => {
  const trimmed = code.trim().toUpperCase();
  if (trimmed.length === 5) {
    navigate(`/room/${trimmed}`);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Join Quiz</h1>

        <input
          type="text"
          placeholder="Enter Room Code"
          value={code}
          onChange={(e) =>
            setCode(e.target.value.toUpperCase())
          }
          maxLength={5}
          className="border p-3 rounded w-full text-center text-lg mb-4 tracking-widest"
        />

        <button
          onClick={joinRoom}
          className="bg-green-600 text-white px-6 py-3 rounded-lg w-full"
        >
          Join Room
        </button>
      </div>
    </div>
  );
}
