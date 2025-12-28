# AI Quiz Generator 🎓🤖

An AI-powered real-time quiz platform built using **React + Vite**, **Node.js**, **Socket.IO**, and **OpenRouter AI**.  
Teachers can generate quizzes using AI, create live rooms, and monitor student answers with live charts.  
Students can join using a room code and participate in quizzes in real time.

---

## 🚀 Features

### 👨‍🏫 Teacher
- Generate quizzes using AI (topic + difficulty)
- Create a live quiz room
- See number of students joined
- Start quiz manually
- View **live answer distribution charts**
- Lock late student entries after quiz starts

### 👩‍🎓 Student
- Join quiz using room code
- Wait in lobby until quiz starts
- Answer questions in real time
- Auto navigation when quiz starts
- Final score shown after completion

---

## 🧠 AI Integration

- Uses **OpenRouter API**
- Model: `mistralai/mistral-7b-instruct`
- AI generates:
  - Multiple choice questions
  - 4 options per question
  - Single correct answer
- Strict JSON-only response enforced

---

## 🛠 Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Socket.IO Client
- Recharts (Live charts)

### Backend
- Node.js
- Express
- Socket.IO
- Axios
- OpenRouter AI API
- dotenv

---

## 📁 Project Structure
```text
Ai-Quiz-Generator/
│
├── server/
│   ├── index.js        # Backend + Socket.IO
│   ├── ai.js           # AI quiz generation logic
│   └── .env            # API keys
│
├── src/
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── CreateRoom.jsx
│   │   ├── TeacherRoom.jsx
│   │   ├── StudentJoin.jsx
│   │   ├── StudentRoom.jsx
│   │   └── StudentQuiz.jsx
│   └── App.jsx
│
└── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Adhii04/Ai-Quiz-Generator.git
cd Ai-Quiz-Generator
```
## ⚙️ Backend Setup

```bash
cd server
npm install
```

## Run the backend

```bash
node index.js
```
## 🎨 Frontend Setup

```bash
cd ..
npm install
npm run dev -- --host
```

# AI Real-Time Quiz Application

## 🧪 How to Use

### 👨‍🏫 Teacher Flow
1. Open the app.
2. Click **Create Quiz (Teacher)**.
3. Enter the quiz topic & difficulty level.
4. Generate the quiz using AI.
5. Create a room and share the **Room Code**.
6. Start the quiz.
7. View live answer charts as students respond.

### 👩‍🎓 Student Flow
1. Open the app.
2. Click **Join Quiz (Student)**.
3. Enter the **Room Code**.
4. Wait for the teacher to start the quiz.
5. Answer questions in real-time.

---

## 📊 Features
* **AI-based quiz generation:** Automatically creates questions based on topics.
* **Live room system:** Uses unique room codes for sessions.
* **Real-time student count:** Track how many students have joined.
* **Live answer submission:** Instant feedback on student responses.
* **Teacher-side live charts:** Visual data representation of class performance.
* **Late-join blocking:** Prevents entry after the quiz starts to ensure fairness.
* **Mobile-friendly UI:** Optimized for various screen sizes.

---

## 🔒 Current Limitations
* **No user authentication:** The system currently does not require login.
* **No database:** Uses in-memory storage only (data is lost on restart).
* **Volatile Data:** Quiz resets on server restart.
* **No persistent history:** Past quiz results are not saved.

---

## 🔮 Future Enhancements
* [ ] Student login with names.
* [ ] Database integration (MongoDB).
* [ ] Quiz history & analytics dashboard.
* [ ] Better timer synchronization.
* [ ] Mobile UI improvements.
* [ ] Deployment (Render / Vercel).


---

## 📜 License
This project is built for educational purposes.
