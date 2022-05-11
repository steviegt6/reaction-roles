import { SlashCommandBuilder } from "@discordjs/builders";
import { Emoji, TextChannel } from "discord.js";
import {
  addReaction,
  getMessageId,
  getMessageIdFromId as getMessageFromId,
  makeMessageId,
} from "../config/clientConfig";
import { makeDefaultEmbed } from "../embeds/embed";
import Command from "./command";

const RefreshRolesData = new SlashCommandBuilder()
  .setName("refreshroles")
  .setDescription("Refreshes the roles of users.")
  .addIntegerOption((o) =>
    o
      .setName("id")
      .setDescription("The message's Reaction Roles ID.")
      .setRequired(true)
  );

export const RefreshRoles: Command = {
  data: RefreshRolesData.toJSON(),
  execute: async (client, interaction) => {
    async function fail(reason: string) {
      await interaction.followUp({
        embeds: [
          makeDefaultEmbed(client, interaction)
            .setTitle("Role Addition Unsuccessful")
            .setDescription(reason),
        ],
      });
    }

    const id = interaction.options.get("id");

    if (!id || id.value === null || id.value === undefined) {
      await fail("You must provide a message ID.");
      return;
    }

    if (!interaction.guild) {
      await fail("You must be in a server to use this command.");
      return;
    }

    if (!interaction.channel) {
      await fail("You must be in a channel to use this command.");
      return;
    }

    const messageID = id.value as number;

    const messageCfg = getMessageFromId(interaction.guild.id, messageID);

    if (!messageCfg) {
      await fail("That message ID is not registered.");
      return;
    }

    const channelCache = await client.channels.fetch(messageCfg.channel);

    if (!channelCache) {
      await fail("Associated channel could not be found.");
      return;
    }

    const textChannel = channelCache as TextChannel;
    const cachedMessage = await textChannel.messages.fetch(
      messageCfg.messageid
    );

    const reactions = await cachedMessage.awaitReactions();
    console.log(reactions);
    for (const registeredReactions of messageCfg.reactions) {
    }

    await interaction.followUp({
      embeds: [
        makeDefaultEmbed(client, interaction)
          .setTitle("Role Refresh Successful")
          .setDescription(`Refreshed roles.`),
      ],
    });
  },
};
