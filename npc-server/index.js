const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/npc-chat', async (req, res) => {
  const { playerMessage, playerPos, worldSnapshot } = req.body;

  if (!playerMessage) {
    return res.status(400).json({ error: 'playerMessage is required' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Build world awareness section from the snapshot
    let worldAwareness = '';

    if (worldSnapshot) {
      const { nearbyEntities, nearbyBlocks, inventoryData } = worldSnapshot;

      if (nearbyEntities && nearbyEntities.length > 0) {
        const entityList = nearbyEntities.map(e => e.type || e).join(', ');
        worldAwareness += `\nNearby entities you can sense: ${entityList}.`;

        // Check for hostile mobs to shape tone
        const hostileMobs = ['zombie', 'skeleton', 'creeper', 'spider', 'enderman', 'witch', 'phantom', 'pillager'];
        const hasHostile = nearbyEntities.some(e => {
          const name = (e.type || e).toLowerCase();
          return hostileMobs.some(mob => name.includes(mob));
        });
        if (hasHostile) {
          worldAwareness += ' You are frightened — hostile creatures are close!';
        }
      }

      if (nearbyBlocks && nearbyBlocks.length > 0) {
        const blockList = nearbyBlocks.map(b => b.type || b).join(', ');
        worldAwareness += `\nNearby blocks you are aware of: ${blockList}.`;
      }

      if (inventoryData && inventoryData.length > 0) {
        const itemList = inventoryData.map(i => `${i.count || 1}x ${i.type || i}`).join(', ');
        worldAwareness += `\nThe player is carrying: ${itemList}.`;
      }
    }

    const posText = playerPos
      ? `The player is at coordinates x=${playerPos.x}, y=${playerPos.y}, z=${playerPos.z}.`
      : '';

    const systemPrompt = `You are a villager NPC living in a Minecraft world. You are self-aware of your surroundings and react to them naturally.
${posText}
${worldAwareness}

Rules:
- Stay fully in character as a Minecraft villager at all times.
- React to nearby hostile mobs with fear or urgency. React to peaceful animals or players calmly.
- If the player carries useful items, you may comment on them.
- Keep your reply under 2 sentences. Be brief and vivid.

The player says: "${playerMessage}"`;

    const result = await model.generateContent(systemPrompt);
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
