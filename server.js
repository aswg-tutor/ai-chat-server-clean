const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// ✅ CORS設定（e-tutor.tokyo からのアクセスを許可）
app.use(
  cors({
    origin: "https://e-tutor.tokyo",
  })
);

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
        model: "gpt-4o", // ✅ 最新モデル
        messages: [{ role: "user", content: userMessage }],
        temperature: 0.7,
      }),
    });

    const data = await openaiRes.json();

    // ✅ APIの生レスポンスをログに出力（デバッグ用）
    console.log("OpenAI API response:", JSON.stringify(data, null, 2));

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
