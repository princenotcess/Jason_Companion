# AI NPC Addon — Bedrock Edition

Custom humanoid NPC entity (`ai_npc:humanoid`) with player-style geometry, working limb animations, and real AI conversation powered by Google Gemini.

---

## File Structure

```
addon/
├── behavior_pack/
│   ├── manifest.json
│   ├── entities/ai_npc.json               ← entity behavior + navigation
│   ├── functions/summon_npc.mcfunction    ← /function summon_npc
│   └── scripts/main.js                   ← ⭐ interaction + AI chat bridge
└── resource_pack/
    ├── manifest.json
    ├── entity/ai_npc.entity.json
    ├── models/entity/ai_npc.geo.json      ← player-style humanoid geometry
    ├── animations/ai_npc.animation.json
    ├── render_controllers/ai_npc.render_controllers.json
    └── textures/entity/
        └── ai_npc.png                    ← replace with any 64×64 player skin
```

---

## How It Works

1. Player **taps / right-clicks** Jason → a text input form pops up
2. Player types a message → script collects nearby entities + player position
3. Script POSTs the data to your **Railway server** (`/npc-chat`)
4. Server builds a Gemini prompt with Jason's personality + world context
5. Jason's reply appears in chat as `Jason: ...`

---

## Setup

### 1 — Set your Railway URL

Open `behavior_pack/scripts/main.js` and replace the placeholder:

```js
const SERVER_URL = "https://YOUR_RAILWAY_URL.railway.app/npc-chat";
```

with your actual Railway deployment URL.

### 2 — Enable Beta APIs in your world

Jason's script uses `@minecraft/server-net` to make HTTP requests, which requires:

> **World Settings → Experiments → Beta APIs → ON**

This must be enabled before loading the world. You only need to do it once.

### 3 — Add a skin (optional)

Drop any **64×64 Minecraft player skin PNG** at:
```
resource_pack/textures/entity/ai_npc.png
```
The placeholder is a simple blue-shirt figure. Any skin you like works.

### 4 — Install the packs (mobile)

1. Copy `behavior_pack/` → `games/com.mojang/behavior_packs/`
2. Copy `resource_pack/` → `games/com.mojang/resource_packs/`
3. Enable both packs on your world (behavior pack first, then resource pack)
4. Make sure **cheats are ON** (needed for `/function`)

---

## Summoning Jason

```
/function summon_npc
```
or directly:
```
/summon ai_npc:humanoid ~ ~ ~ minecraft:entity_spawned Jason
```

---

## Talking to Jason

Just **tap him**. A dialog box opens — type anything. His reply appears in your chat in a few seconds.

If you see `§cCouldn't reach Jason's brain` — your Railway server is either down or the URL in `main.js` is wrong.

---

## Entity Reference

| Property            | Value                           |
|---------------------|---------------------------------|
| Identifier          | `ai_npc:humanoid`               |
| Display name        | Jason                           |
| Type family         | `humanoid, ai_npc, mob`         |
| Health              | 20 HP                           |
| Movement speed      | 0.25 (slow wander)              |
| Summonable          | Yes / Spawnable: No             |
| Min Bedrock version | 1.20.0                          |
| Experiments needed  | Beta APIs                       |

---

## License

MIT
