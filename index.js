const express = require("express");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Твой Discord Webhook
const webhook = "https://discord.com/api/webhooks/1397128931567603742/ICteuf__9KOTzicVn7lysg7AFbe16q7o2lebabbArWxq-t9bHrfPCbbiVY3zLZTJI9xT";

// Поддержка JSON и URL-encoded запросов
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ GET-запрос: ?msg=...
app.get("/", async (req, res) => {
  const msg = req.query.msg;

  if (!msg) {
    return res.status(400).send("❌ Missing 'msg' parameter");
  }

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: msg })
    });

    if (!response.ok) {
      const error = await response.text();
      return res.status(500).send("❌ Discord error: " + error);
    }

    res.send("✅ Text message sent to Discord");
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).send("❌ Internal server error");
  }
});

// ✅ POST-запрос: JSON-данные (например, embeds)
app.post("/", async (req, res) => {
  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });

    if (!response.ok) {
      const error = await response.text();
      return res.status(500).send("❌ Discord error: " + error);
    }

    res.send("✅ JSON payload sent to Discord");
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).send("❌ Internal server error");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Discord proxy is running at http://localhost:${PORT}`);
});
