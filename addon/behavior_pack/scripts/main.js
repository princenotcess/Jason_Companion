import { world, system } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";
import { HttpRequest, HttpRequestMethod, HttpClient, HttpHeader } from "@minecraft/server-net";

// ✏️  Your Railway server URL — no trailing slash
const SERVER_URL = "https://YOUR_RAILWAY_URL.railway.app/npc-chat";

const http = new HttpClient();

// ─── Startup confirmation ─────────────────────────────────────────────────────
system.run(() => {
  world.sendMessage("§a[Jason] Script loaded. Type §e@jason <message> §ato talk.");
  if (SERVER_URL.includes("YOUR_RAILWAY_URL")) {
    world.sendMessage("§c[Jason] WARNING: SERVER_URL is still a placeholder. Open scripts/main.js and paste your Railway URL.");
  }
});

// ─── Method 1: Chat command  "@jason <message>" ───────────────────────────────
// Most reliable on mobile — just type in chat.
world.beforeEvents.chatSend.subscribe((event) => {
  const raw = event.message.trim();
  if (!raw.toLowerCase().startsWith("@jason ")) return;

  event.cancel = true; // hide the raw message from chat
  const playerMessage = raw.slice(7).trim();
  if (!playerMessage) return;

  const player = event.sender;
  system.run(() => sendToJason(player, playerMessage));
});

// ─── Method 2: Tap / long-press Jason ────────────────────────────────────────
// On PC: right-click. On mobile: long-press, then tap the interact button.
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

  const req = new HttpRequest(SERVER_URL);
  req.method = HttpRequestMethod.Post;
  req.headers = [new HttpHeader("Content-Type", "application/json")];
  req.body = payload;
  req.timeout = 15;

  http.request(req)
    .then((res) => {
      try {
        const data = JSON.parse(res.body);
        if (data.response) {
          player.sendMessage(`§6Jason§r: §f${data.response}`);
        } else if (data.error) {
          player.sendMessage(`§cJason's server error: ${data.error}`);
        } else {
          player.sendMessage("§cJason just stared at you. (Empty response)");
        }
      } catch (e) {
        player.sendMessage(`§cBad response from server: ${e.message}`);
      }
    })
    .catch((err) => {
      player.sendMessage(`§cHTTP failed: ${err?.message ?? "no error info"}. Check Beta APIs is ON and SERVER_URL is correct.`);
    });
}
