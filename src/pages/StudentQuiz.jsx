import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";

const QUESTION_TIME = 15;
const BACKEND_URL = "http://192.168.1.3:3001";

export default function StudentQuiz() {
  const { roomCode } = useParams();

  const [quizData, setQuizData] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [quizFinished, setQuizFinished] = useState(false);

  const socketRef = useRef(null);

  /* ===============================
     1️⃣ CONNECT + JOIN ROOM
     =============================== */
  useEffect(() => {
    const socket = io(BACKEND_URL);
    socketRef.current = socket;

    console.log("Student quiz joining room:", roomCode);

    socket.emit("join-room", {
      roomCode,
      role: "student",
    });

    // 🔥 Fetch quiz IMMEDIATELY
    fetch(`${BACKEND_URL}/api/get-quiz/${roomCode}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Quiz loaded:", data.quiz);
        setQuizData(data.quiz);
      })
      .catch((err) => {
        console.error("Failed to load quiz", err);
      });

    return () => socket.disconnect();
  }, [roomCode]);

  /* ===============================
     2️⃣ TIMER
     =============================== */
  useEffect(() => {
    if (quizFinished || selected !== null) return;

    if (timeLeft === 0) {
      goNext();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, selected, quizFinished]);

  if (quizData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">Loading quiz…</p>
      </div>
    );
  }

  const question = quizData[current];

  /* ===============================
     3️⃣ ANSWER
     =============================== */
  const handleClick = (index) => {
    if (selected !== null) return;

    setSelected(index);

    socketRef.current.emit("submit-answer", {
      roomCode,
      questionIndex: current,
      optionIndex: index,
    });

    if (index === question.answer) {
      setScore((s) => s + 1);
    }
  };

  const goNext = () => {
    if (current < quizData.length - 1) {
      setCurrent((c) => c + 1);
      setSelected(null);
      setTimeLeft(QUESTION_TIME);
    } else {
      setQuizFinished(true);
    }
  };

  /* ===============================
     4️⃣ UI
     =============================== */
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-3">
      <div className="bg-white w-full max-w-xl p-5 rounded-xl shadow-lg">

        {!quizFinished && (
          <div className="flex justify-between mb-4 font-semibold">
            <span>
              Question {current + 1}/{quizData.length}
            </span>
            <span className="text-red-600">⏱ {timeLeft}s</span>
            <span>Score: {score}</span>
          </div>
        )}

        {quizFinished ? (
          <div className="text-center py-10">
            <h2 className="text-xl font-bold mb-4">
              Quiz Completed 🎉
            </h2>
            <p className="text-lg">
              Final Score: <b>{score}/{quizData.length}</b>
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-semibold mb-6">
              {question.question}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {question.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleClick(i)}
                  disabled={selected !== null}
                  className={`border rounded-lg py-4 px-3 ${
                    selected === i
                      ? i === question.answer
                        ? "bg-green-200"
                        : "bg-red-200"
                      : ""
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            {selected !== null && (
              <div className="mt-6 flex justify-end">
                <button
                  onClick={goNext}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
