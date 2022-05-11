import { Client, TextChannel } from "discord.js";
import { config } from "../config/clientConfig";
import { registerdCommands } from "../commands/command";

export default function ready(client: Client) {
  client.on("ready", async () => {
    if (!client.user || !client.application) {
      console.warn("[init] client.user or client.application is undefined");
      return;
    }

    // @ts-ignore
    client.application.commands.set(registerdCommands.map((x) => x.data));

    console.log("[init] logged in as", client.user.tag);

    for (const guild in config.guilds) {
      const guildCache = await client.guilds.fetch(
        config.guilds[guild].guildid
      );

      for (const reactions in config.guilds[guild].messageReactions) {
        const reaction = config.guilds[guild].messageReactions[reactions];
        const channelCache = guildCache.channels.cache.get(reaction.channel);

        if (channelCache instanceof TextChannel) {
          const textChannel = channelCache as TextChannel;
          await textChannel.messages.fetch(reaction.messageid);
        }
      }
    }
  });
}
