const express = require("express");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Замените на свой Discord webhook
const webhookUrl = "https://discord.com/api/webhooks/1397128927222169690/RMNYuy4W6sY9jhQX6t7EJRhI1fpAI3iNIV88PnRToi7LKKm-drsTeiLQ1O8ZgJAfOl-J";

// 👇 Позволяет Express читать URL-параметры
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/", async (req, res) => {
  try {
    const msg = req.body.embeds || req.body.content || req.body.msg;
    if (!msg) {
      return res.status(400).json({ error: "No message content provided." });
    }

    // Удалим возможные Discord-форматирования (```, `)
    const cleaned = JSON.stringify(msg)
      .replace(/```/g, "")
      .replace(/`/g, "")
      .trim();

    const payload = {
      content: null,
      embeds: JSON.parse(cleaned),
    };

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      res.status(200).json({ status: "✅ Webhook sent successfully." });
    } else {
      const text = await response.text();
      res.status(response.status).json({ error: text });
    }
  } catch (err) {
    console.error("Ошибка:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});

// Заглушка на GET, чтобы Render не ругался на отсутствие маршрутов
app.get("/", (req, res) => {
  res.send("Nameless Webhook Service работает ✅");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
