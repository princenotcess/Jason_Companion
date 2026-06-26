# Jason — AI NPC Addon for Minecraft Bedrock

A Minecraft Bedrock addon featuring **Jason**, a grumpy-but-caring humanoid AI NPC powered by Google Gemini. Jason wanders around, reacts to the world, and holds real conversations driven by your game's live world data.

---

## What's Inside

```
├── npc-server/          # Node.js Express server — AI brain
│   ├── index.js         # Single-file server, /npc-chat endpoint
│   └── package.json
└── addon/
    ├── behavior_pack/   # Entity logic, navigation, idle behaviors
    │   ├── entities/ai_npc.json
    │   └── functions/summon_npc.mcfunction
    └── resource_pack/   # Humanoid model, animations, render setup
        ├── entity/ai_npc.entity.json
        ├── models/entity/ai_npc.geo.json
        ├── animations/ai_npc.animation.json
        └── render_controllers/ai_npc.render_controllers.json
```

---

## Features

- **Custom humanoid entity** — player-style geometry (head, body, arms, legs) with a 64×64 skin UV layout
- **Working limb animations** — idle arm sway, full walk cycle (arms + legs), head tracking toward players
- **World-aware AI** — reads `nearbyEntities`, `nearbyBlocks`, and `inventoryData` from your game and feeds them into the Gemini prompt
- **Reactive personality** — Jason reacts to zombies with irritated alarm, notices your gear, and softens if you're kind — but never admits it
- **Autonomous wandering** — random stroll, random look-around, and player look-at behaviors so he feels alive when idle

---

## Jason's Personality

Jason is grumpy, blunt, and tired. He complains. He sighs. He walks away mid-conversation.  
But if a zombie shows up, he'll quietly stand between you and it.  
He speaks in short, dry sentences. No exclamation marks. No cheerfulness.

> *"Oh great, a creeper. Just what I needed today."*  
> *"...nice sword, I guess."*  
> *"I'm not running. I'm walking briskly."*

---

## Server Setup

### Requirements
- Node.js 18+
- A Google Gemini API key → [Get one free at Google AI Studio](https://aistudio.google.com/app/apikey)

### Run locally
```bash
cd npc-server
npm install
GEMINI_API_KEY=your_key_here node index.js
```

Server starts on port `3000`.

### API — `POST /npc-chat`

```json
{
  "playerMessage": "Hey Jason, what's up?",
  "playerPos": { "x": 10, "y": 64, "z": -5 },
  "worldSnapshot": {
    "nearbyEntities": [{ "type": "zombie" }, { "type": "cow" }],
    "nearbyBlocks":   [{ "type": "grass" }, { "type": "oak_log" }],
    "inventoryData":  [{ "type": "diamond_sword", "count": 1 }]
  }
}
```

All fields except `playerMessage` are optional. The server responds with:

```json
{ "response": "Oh great, a zombie. And you brought a diamond sword. Show-off." }
```

---

## Addon Setup

### Adding Jason's Skin

Jason uses a standard **64×64 Minecraft player skin**. Drop any skin PNG at:
```
addon/resource_pack/textures/entity/ai_npc.png
```

Any player skin works — the geometry maps to the standard UV layout.

### Installing on Mobile (iOS / Android)

1. Copy `addon/behavior_pack/` → `games/com.mojang/behavior_packs/`
2. Copy `addon/resource_pack/` → `games/com.mojang/resource_packs/`
3. Enable both packs on your world (behavior pack first)
4. Run `/function summon_npc` in-game

### Summoning Jason

```
/function summon_npc
```
Spawns Jason at your position, already named. Alternatively:
```
/summon ai_npc:humanoid ~ ~ ~ minecraft:entity_spawned Jason
```

---

## Entity Reference

| Property       | Value                        |
|----------------|------------------------------|
| Identifier     | `ai_npc:humanoid`            |
| Display name   | Jason                        |
| Type family    | `humanoid, ai_npc, mob`      |
| Health         | 20 HP                        |
| Movement speed | 0.25 (slow wander)           |
| Summonable     | Yes / Spawnable: No          |
| Minimum Bedrock version | 1.20.0              |

---

## License

MIT
