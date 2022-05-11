import { Client } from "discord.js";
import interactionCreate from "./interactionCreateListener";
import reactionUpdate from "./reactionUpdateListener";
import ready from "./readyListener";

export default function initiateListeners(client: Client) {
  console.log("[init] adding listeners");

  ready(client);
  interactionCreate(client);
  reactionUpdate(client);
}
