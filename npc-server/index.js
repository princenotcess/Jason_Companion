const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/npc-chat', async (req, res) => {
  const { playerMessage, playerPos } = req.body;

  if (!playerMessage) {
    return res.status(400).json({ error: 'playerMessage is required' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = playerPos
      ? `You are a villager NPC in a Minecraft world. The player is standing at coordinates x=${playerPos.x}, y=${playerPos.y}, z=${playerPos.z} and says: "${playerMessage}". Reply in character as a friendly but brief villager. Keep your answer under 2 sentences.`
      : `You are a villager NPC in a Minecraft world. The player says: "${playerMessage}". Reply in character as a friendly but brief villager. Keep your answer under 2 sentences.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json({ response: text });
  } catch (err) {
    console.error('Gemini error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`NPC Chat server running on port ${PORT}`);
});
