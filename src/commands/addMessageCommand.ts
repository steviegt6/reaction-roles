import { SlashCommandBuilder } from "@discordjs/builders";
import { TextChannel } from "discord.js";
import { getMessageId, makeMessageId } from "../config/clientConfig";
import { makeDefaultEmbed } from "../embeds/embed";
import Command from "./command";

const AddMessageData = new SlashCommandBuilder()
  .setName("addmessage")
  .setDescription("Adds a message to the reaction role registry.")
  .addChannelOption((o) =>
    o
      .setName("channel")
      .setDescription("The channel containing the message")
      .setRequired(true)
  )
  .addStringOption((o) =>
    o
      .setName("messageid")
      .setDescription("The message's identifier.")
      .setRequired(true)
  );

export const AddMessage: Command = {
  data: AddMessageData.toJSON(),
  execute: async (client, interaction) => {
    async function fail(reason: string) {
      await interaction.followUp({
        embeds: [
          makeDefaultEmbed(client, interaction)
            .setTitle("Message Registration Unsuccessful")
            .setDescription(reason),
        ],
      });
    }

    const channel = interaction.options.get("channel");
    const messageID = interaction.options.get("messageid");

    if (!channel || !channel.channel) {
      await fail("The provided channel was not found.");
      return;
    }

    if (!(channel.channel instanceof TextChannel)) {
      await fail("The provided channel is not a text channel.");
      return;
    }

    const textChannel = channel.channel as TextChannel;

    if (!messageID) {
      await fail("You must provide a message ID.");
      return;
    }

    let registrationID = getMessageId(
      textChannel.guild.id,
      textChannel.id,
      messageID.value as string
    );

    if (registrationID !== undefined) {
      await fail(
        `The provided message is already registered under the ID: \`${registrationID}\`.`
      );
      return;
    }

    let message = undefined;

    try {
      message = await textChannel.messages.fetch(messageID.value as string);
    } catch {
      await fail("The provided message was not found.");
      return;
    }

    registrationID = makeMessageId(
      textChannel.guild.id,
      textChannel.id,
      messageID.value as string
    );

    //console.log([textChannel.guild.id, textChannel.id, messageID.value]);

    await interaction.followUp({
      embeds: [
        makeDefaultEmbed(client, interaction)
          .setTitle("Message Registration Successful")
          .setDescription(
            `Registered message in channel <#${channel.value}> under new ID: \`${registrationID}\`.`
          ),
      ],
    });
  },
};
