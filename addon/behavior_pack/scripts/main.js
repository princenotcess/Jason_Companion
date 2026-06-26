import { world } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";
import { HttpRequest, HttpRequestMethod, HttpClient, HttpHeader } from "@minecraft/server-net";

// ✏️  Paste your Railway URL here (no trailing slash)
const SERVER_URL = "https://YOUR_RAILWAY_URL.railway.app/npc-chat";

const http = new HttpClient();

world.afterEvents.playerInteractWithEntity.subscribe((event) => {
  const { player, target } = event;

  // Only react when the player taps Jason specifically
  if (target.typeId !== "ai_npc:humanoid") return;

  new ModalFormData()
    .title("§6Talk to Jason")
    .textField("What do you say?", "Type your message...")
    .show(player)
    .then((result) => {
      if (result.canceled) return;

      const message = (result.formValues?.[0] ?? "").trim();
      if (!message) return;

      const pos = player.location;

      // Collect nearby entities for world awareness
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
            } else {
              player.sendMessage("§cJason just stared at you blankly.");
            }
          } catch {
            player.sendMessage("§cJason muttered something incomprehensible.");
          }
        })
        .catch(() => {
          player.sendMessage("§cCouldn't reach Jason's brain. Is the server running?");
        });
    });
});
