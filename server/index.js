require("dotenv").config();
const { generateQuiz } = require("./ai");

const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// ===============================
// MIDDLEWARE
// ===============================
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://192.168.1.3:5173",
    ],
    methods: ["GET", "POST"],
  })
);

app.use(express.json());

// ===============================
// SOCKET.IO
// ===============================
const io = new Server(server, {
  cors: { origin: "*" },
});

// ===============================
// STORAGE
// ===============================

// roomCode -> Set(socketIds)
const rooms = {};

// roomCode -> quiz state
const roomState = {};

// Temporary quiz before room creation
let pendingQuiz = null;

console.log(
  "API KEY EXISTS:",
  !!process.env.OPENROUTER_API_KEY
);

// ===============================
// AI QUIZ GENERATION
// ===============================
app.post("/api/generate-quiz", async (req, res) => {
  try {
    const { topic, difficulty, count } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "Topic required" });
    }

    const quiz = await generateQuiz(
      topic,
      difficulty || "Medium",
      count || 5
    );

    pendingQuiz = quiz;
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI generation failed" });
  }
});

// ===============================
// CREATE ROOM
// ===============================
app.post("/api/create-room", (req, res) => {
  if (!pendingQuiz) {
    return res
      .status(400)
      .json({ error: "Generate quiz first" });
  }

  const roomCode = Math.random()
    .toString(36)
    .substring(2, 7)
    .toUpperCase();

  roomState[roomCode] = {
    started: false,
    answers: {},
    quiz: pendingQuiz,
  };

  rooms[roomCode] = new Set();
  pendingQuiz = null;

  res.json({ roomCode });
});

// ===============================
// GET QUIZ
// ===============================
app.get("/api/get-quiz/:roomCode", (req, res) => {
  const room = roomState[req.params.roomCode];
  if (!room || !room.quiz) {
    return res.status(404).json({ error: "Quiz not found" });
  }
  res.json({ quiz: room.quiz });
});

// ===============================
// SOCKET EVENTS
// ===============================
io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  // JOIN ROOM
  socket.on("join-room", ({ roomCode, role }) => {
    console.log("JOIN:", role, roomCode);

    // ✅ Always ensure room exists
    if (!roomState[roomCode]) {
      roomState[roomCode] = {
        started: false,
        answers: {},
        quiz: null,
      };
      rooms[roomCode] = new Set();
    }

    // ❌ Block late students
    if (roomState[roomCode].started && role === "student") {
      socket.emit("join-denied");
      return;
    }

    socket.join(roomCode);
    socket.roomCode = roomCode;
    socket.role = role;

    rooms[roomCode].add(socket.id);

    io.to(roomCode).emit(
      "room-count",
      rooms[roomCode].size
    );
  });

  // START QUIZ
  socket.on("start-quiz", (roomCode) => {
    console.log("START QUIZ:", roomCode);

    if (!roomState[roomCode]) return;
    roomState[roomCode].started = true;

    for (const [, s] of io.of("/").sockets) {
      if (s.roomCode === roomCode && s.role === "student") {
        s.emit("quiz-started");
      }
    }
  });

  // SUBMIT ANSWER
  socket.on("submit-answer", ({ roomCode, questionIndex, optionIndex }) => {
    const room = roomState[roomCode];
    if (!room) return;

    if (!room.answers[questionIndex]) {
      room.answers[questionIndex] = {};
    }

    room.answers[questionIndex][optionIndex] =
      (room.answers[questionIndex][optionIndex] || 0) + 1;

    // Send stats only to teacher
    for (const [, s] of io.of("/").sockets) {
      if (s.roomCode === roomCode && s.role === "teacher") {
        s.emit("answer-stats", {
          questionIndex,
          stats: room.answers[questionIndex],
        });
      }
    }
  });

  socket.on("disconnect", () => {
    if (!socket.roomCode) return;

    rooms[socket.roomCode]?.delete(socket.id);

    if (rooms[socket.roomCode]?.size === 0) {
      delete rooms[socket.roomCode];
      delete roomState[socket.roomCode];
    } else {
      io.to(socket.roomCode).emit(
        "room-count",
        rooms[socket.roomCode].size
      );
    }
  });
});

// ===============================
server.listen(3001, "0.0.0.0", () => {
  console.log("Backend running:");
  console.log("➡ http://localhost:3001");
  console.log("➡ http://192.168.1.3:3001");
});
