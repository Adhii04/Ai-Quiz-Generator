import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/home";
import CreateRoom from "./pages/CreateRoom";
import TeacherRoom from "./pages/TeacherRoom";
import StudentRoom from "./pages/StudentRoom";
import StudentQuiz from "./pages/StudentQuiz";
import StudentJoin from "./pages/studentjoin";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* 👨‍🏫 TEACHER FLOW */}
        <Route path="/teacher" element={<CreateRoom />} />
        <Route path="/teacher-room/:roomCode" element={<TeacherRoom />} />

        {/* 👩‍🎓 STUDENT FLOW */}
        <Route path="/student-join" element={<StudentJoin />} />
        <Route path="/room/:roomCode" element={<StudentRoom />} />
        <Route path="/quiz/:roomCode" element={<StudentQuiz />} />
      </Routes>
    </BrowserRouter>
  );
}
