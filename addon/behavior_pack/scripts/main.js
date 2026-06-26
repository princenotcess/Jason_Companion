import { world, system } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";

// Railway server URL
const SERVER_URL = "https://jasoncompanion-production.up.railway.app/npc-chat";

// ─── Startup confirmation ─────────────────────────────────────────────────────
system.run(() => {
  world.sendMessage("§a[Jason] Script loaded. Type §e@jason <message> §ato talk.");
});

// ─── Method 1: Chat command  "@jason <message>" ───────────────────────────────
world.beforeEvents.chatSend.subscribe((event) => {
  const raw = event.message.trim();
  if (!raw.toLowerCase().startsWith("@jason ")) return;

  event.cancel = true;
  const playerMessage = raw.slice(7).trim();
  if (!playerMessage) return;

  const player = event.sender;
  system.run(() => sendToJason(player, playerMessage));
});

// ─── Method 2: Tap Jason → form appears ──────────────────────────────────────
world.afterEvents.playerInteractWithEntity.subscribe((event) => {
  const { player, target } = event;
  if (target.typeId !== "ai_npc:humanoid") return;

  new ModalFormData()
    .title("§6Talk to Jason")
    .textField("What do you say?", "Type your message...")
    .show(player)
    .then((result) => {
      if (result.canceled) return;
      const message = (result.formValues?.[0] ?? "").trim();
      if (!message) return;
      sendToJason(player, message);
    });
});

// ─── Core: send message to Railway server ────────────────────────────────────
function sendToJason(player, message) {
  const pos = player.location;

  const nearbyEntities = player.dimension
    .getEntities({ location: pos, maxDistance: 12 })
    .filter(e => e.typeId !== "ai_npc:humanoid" && e.typeId !== "minecraft:player")
    .slice(0, 8)
    .map(e => ({ type: e.typeId.replace("minecraft:", "") }));

  const payload = JSON.stringify({
    playerMessage: message,
    playerPos: {
      x: Math.floor(pos.x),
      y: Math.floor(pos.y),
      z: Math.floor(pos.z)
    },
    worldSnapshot: { nearbyEntities }
  });

  player.sendMessage("§8Jason is thinking...");

  fetch(SERVER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload
  })
    .then(res => res.json())
    .then(data => {
      if (data.response) {
        player.sendMessage(`§6Jason§r: §f${data.response}`);
      } else if (data.error) {
        player.sendMessage(`§cServer error: ${data.error}`);
      } else {
        player.sendMessage("§cJason just stared at you. (Empty response)");
      }
    })
    .catch(err => {
      player.sendMessage(`§cCould not reach Jason's server: ${err?.message ?? "unknown error"}`);
    });
}
