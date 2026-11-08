const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// 🔑 Get your free key from: https://aistudio.google.com/apikey
const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY_HERE';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Call real Gemini AI
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
    
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text 
      || "Sorry, I couldn't process that.";
    return reply;
  } catch (error) {
    console.error('AI Error:', error);
    return "⚠️ AI connection issue. Check your API key or internet.";
  }
}

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });

  const reply = await getAIResponse(message);
  res.json({ reply });
});

app.listen(PORT, () => {
  console.log(`🚀 AI App running at http://localhost:${PORT}`);
});
