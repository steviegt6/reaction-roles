import { Client, Interaction, MessageEmbed } from "discord.js";

export const funnyColors: [number, number, number][] = [
  [85, 205, 252],
  [255, 255, 255],
  [247, 168, 184],
];

export function makeDefaultEmbed(
  client: Client,
  interaction: Interaction
): MessageEmbed {
  return new MessageEmbed()
    .setColor(funnyColors[Math.floor(Math.random() * funnyColors.length)])
    .setAuthor({
      name: interaction.user.username,
      iconURL: interaction.user.displayAvatarURL(),
    })
    .setTimestamp()
    .setFooter({ text: "Reaction Roles Service" });
}
