const express = require("express");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

// Позволяет принимать JSON в теле запроса
app.use(express.json());
// Также поддерживает URL-кодированные параметры, если нужно
app.use(express.urlencoded({ extended: true }));

// Обработка POST-запроса с JSON-данными (например, с embeds)
app.post("/", async (req, res) => {
  const webhook = "https://discord.com/api/webhooks/1397128931567603742/ICteuf__9KOTzicVn7lysg7AFbe16q7o2lebabbArWxq-t9bHrfPCbbiVY3zLZTJI9xT";

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body) // Отправляем весь JSON как есть
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(500).send("Failed to send to Discord: " + errText);
    }

    res.send("✅ Sent to Discord!");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("❌ Error sending to Discord");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Discord proxy is running on port ${PORT}`);
});
