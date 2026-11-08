const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Serve your frontend files automatically
app.use(express.static(path.join(__dirname)));

// 🔑 Your Gemini API key here
const GEMINI_API_KEY = 'AQ.Ab8RN6IJHqjD5X5OTu_A__iLI18dsfmwaNhp6cySNmpJWkr8QA';
const GEMINI_API_URL = 'curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent" \
  -H 'Content-Type: application/json' \
  -H 'X-goog-api-key: AQ.Ab8RN6IJHqjD5X5OTu_A__iLI18dsfmwaNhp6cySNmpJWkr8QA' \
  -X POST \
  -d '{
    "contents": [
      {
        "parts": [
          {
            "text": "Explain how AI works in a few words"
          }
        ]
      }
    ]
  }'';

async function getAIResponse(userMessage) {
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userMessage }] }]
      })
    });

    if (!response.ok) throw new Error('Gemini API error');
    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process that.";
  } catch (error) {
    console.error('AI Error:', error);
    return "⚠️ Connection issue — check your API key or internet.";
  }
}

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });
  const reply = await getAIResponse(message);
  res.json({ reply });
});

// Open index.html when visiting localhost:5000
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Running at http://localhost:${PORT}`);
});
