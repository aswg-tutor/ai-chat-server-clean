const express = require("express");
const cors = require("cors"); // ← CORSモジュールを追加
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// ✅ CORSを設定（e-tutor.tokyo からのアクセスを許可）
app.use(cors({
  origin: "https://e-tutor.tokyo",
}));

app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;
  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: userMessage }],
        temperature: 0.7,
      }),
    });

    const data = await openaiRes.json();
    const reply = data.choices?.[0]?.message?.content || "応答がありませんでした。";
    res.json({ reply });
  } catch (error) {
    console.error("APIエラー:", error);
    res.status(500).json({ error: "エラーが発生しました" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
