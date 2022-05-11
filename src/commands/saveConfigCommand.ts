import { SlashCommandBuilder } from "@discordjs/builders";
import { makeDefaultEmbed } from "../embeds/embed";
import { saveConfig } from "../config/clientConfig";
import Command from "./command";

const SaveConfigData = new SlashCommandBuilder()
  .setName("saveconfig")
  .setDescription("Saves the config.");

export const SaveConfig: Command = {
  data: SaveConfigData.toJSON(),
  execute: async (client, interaction) => {
    saveConfig();

    await interaction.followUp({
      embeds: [
        makeDefaultEmbed(client, interaction)
          .setTitle("Saved Config")
          .setDescription("tomat tomat omat oatat oatoamtoamt"),
      ],
    });
  },
};
