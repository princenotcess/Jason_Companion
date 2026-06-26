# AI NPC Addon — Bedrock Edition

Custom humanoid NPC entity (`ai_npc:humanoid`) with player-style geometry and working limb animations.

---

## File Structure

```
addon/
├── behavior_pack/
│   ├── manifest.json
│   ├── entities/ai_npc.json          ← entity behavior definition
│   └── functions/summon_npc.mcfunction
└── resource_pack/
    ├── manifest.json
    ├── entity/ai_npc.entity.json     ← client-side rendering setup
    ├── models/entity/ai_npc.geo.json ← player-style humanoid geometry
    ├── animations/ai_npc.animation.json
    ├── render_controllers/ai_npc.render_controllers.json
    └── textures/entity/
        └── ai_npc.png  ← ⚠️ ADD YOUR OWN SKIN HERE (see below)
```

---

## Adding Your Skin / Texture

The entity uses a **standard 64×64 player skin layout**.

1. Create or download any Minecraft player skin (64×64 PNG).
2. Place it at: `resource_pack/textures/entity/ai_npc.png`
3. The bones map directly to the standard skin UV layout:
   - Head: top-left (0,0)
   - Body: (16,16)
   - Right Arm: (40,16)
   - Left Arm: (32,48)
   - Right Leg: (0,16)
   - Left Leg: (16,48)

Any existing Minecraft skin will work out of the box.

---

## How to Summon

**Option 1 — Function command (recommended):**
```
/function summon_npc
```
Spawns the NPC at your exact position.

**Option 2 — Direct summon:**
```
/summon ai_npc:humanoid ~ ~ ~
```

---

## Installing the Addon

1. Copy `behavior_pack/` into your Minecraft Bedrock behavior packs folder.
2. Copy `resource_pack/` into your resource packs folder.
3. Enable both packs on your world (behavior pack first, then resource pack).
4. Load the world and run `/function summon_npc`.

**On mobile (iOS/Android):** Use a file manager app to move the folders into:
- `games/com.mojang/behavior_packs/`
- `games/com.mojang/resource_packs/`

---

## Entity Properties

| Property       | Value              |
|----------------|--------------------|
| Identifier     | `ai_npc:humanoid`  |
| Type family    | `humanoid, ai_npc, mob` |
| Health         | 20 HP              |
| Height         | 1.8 blocks         |
| Width          | 0.6 blocks         |
| Spawnable      | No (summon only)   |
| Summonable     | Yes                |

---

## Animations

- **Idle:** subtle arm sway while standing
- **Walk:** full arm + leg swing tied to movement distance
- **Head tracking:** head rotates to look at nearby targets
