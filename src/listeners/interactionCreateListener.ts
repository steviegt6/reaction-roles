import { BaseCommandInteraction, Client, Interaction } from "discord.js";
import { registerdCommands } from "../commands/command";

export default function interactionCreate(client: Client) {
  client.on("interactionCreate", async (interaction: Interaction) => {
    if (interaction.isCommand() || interaction.isContextMenu()) {
      await handleSlashCommand(client, interaction);
    }
  });
}

async function handleSlashCommand(
  client: Client,
  interaction: BaseCommandInteraction
): Promise<void> {
  const command = registerdCommands.find(
    (x) => x.data.name === interaction.commandName
  );

  if (!command) {
    interaction.followUp({ content: "Unknown command" });
    return;
  }

  await interaction.deferReply();

  command.execute(client, interaction);
}
