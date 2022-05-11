import { SlashCommandBuilder } from "@discordjs/builders";
import { TextChannel } from "discord.js";
import {
  addReaction,
  getMessageId,
  makeMessageId,
} from "../config/clientConfig";
import { makeDefaultEmbed } from "../embeds/embed";
import Command from "./command";

const AddRoleData = new SlashCommandBuilder()
  .setName("addrole")
  .setDescription("Attaches a role and associated emoji to a message.")
  .addIntegerOption((o) =>
    o
      .setName("id")
      .setDescription("The message's Reaction Roles ID.")
      .setRequired(true)
  )
  .addRoleOption((o) =>
    o
      .setName("role")
      .setDescription("The role that should be granted/taken.")
      .setRequired(true)
  )
  .addStringOption((o) =>
    o
      .setName("emoji")
      .setDescription("The emoji that should be used.")
      .setRequired(true)
  );

export const AddRole: Command = {
  data: AddRoleData.toJSON(),
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
    const role = interaction.options.get("role");
    const emoji = interaction.options.get("emoji");

    if (
      !id ||
      id.value === null ||
      id.value === undefined ||
      !role ||
      !role.value ||
      !emoji ||
      !emoji.value
    ) {
      await fail("You must provide a message ID, role, and emoji.");
      return;
    }

    const messageID = id.value as number;
    const roleID = role.value as string;
    const rawEmoji = emoji.value as string;

    if (!interaction.guild) {
      await fail("You must be in a guild to use this command.");
      return;
    }

    addReaction(interaction.guild?.id, messageID, {
      emoji: rawEmoji,
      role: roleID,
    });

    await interaction.followUp({
      embeds: [
        makeDefaultEmbed(client, interaction)
          .setTitle("Role Addition Successful")
          .setDescription(
            `Registered role <@&${roleID}> to message with ID of \`${messageID}\` using emoji: \`${rawEmoji}\`.`
          ),
      ],
    });
  },
};
