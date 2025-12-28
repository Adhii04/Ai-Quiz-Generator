import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">
          AI Quiz Classroom
        </h1>

        <button
          onClick={() => navigate("/teacher")}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg w-full mb-4"
        >
          Create Quiz (Teacher)
        </button>

        <button
          onClick={() => navigate("/student-join")}
          className="bg-green-600 text-white px-6 py-3 rounded-lg w-full"
        >
          Join Quiz (Student)
        </button>
      </div>
    </div>
  );
}
