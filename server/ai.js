const axios = require("axios");

async function generateQuiz(topic, difficulty, count) {
  const prompt = `
Generate ${count} multiple-choice questions on "${topic}".
Difficulty: ${difficulty}.

Return ONLY valid JSON:
[
  {
    "question": "",
    "options": ["", "", "", ""],
    "answer": 0
  }
]
`;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.6,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost",
          "X-Title": "AI Quiz Generator",
        },
      }
    );

    const content = response.data.choices[0].message.content;
    return JSON.parse(content);

  } catch (err) {
    console.error("OPENROUTER FULL ERROR:");
    console.error(err.response?.data || err.message);
    throw err;
  }
}

module.exports = { generateQuiz };
