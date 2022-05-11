import { Client, Intents } from "discord.js";
import dotenv from "dotenv";
import { configInit } from "./config/clientConfig";
import initiateListeners from "./listeners/listenerLoader";

console.log("[init] reading .env file");
dotenv.config();

console.log("[init] starting bot");
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
});

console.log("[init] initializing config");
configInit();

console.log("[init] adding listeners");
initiateListeners(client);

console.log("[init] logging in");
client.login(process.env.BOT_TOKEN);
