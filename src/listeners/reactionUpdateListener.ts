import {
  Client,
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  User,
} from "discord.js";
import {
  getGuildConfig,
  getMessageId,
  getReactions,
} from "../config/clientConfig";

export default function reactionUpdate(client: Client) {
  client.on("messageReactionAdd", async (reaction, user) => {
    await updateRoles(reaction, user, false);
  });
  client.on("messageReactionRemove", async (reaction, user) => {
    await updateRoles(reaction, user, true);
  });
}

async function updateRoles(
  reaction: MessageReaction | PartialMessageReaction,
  user: User | PartialUser,
  removed: boolean
) {
  if (!reaction.message.guild) {
    console.warn("reaction did not have guild");
    return;
  }

  // const guildConf = getGuildConfig(reaction.message.guild.id);
  const messageId = getMessageId(
    reaction.message.guild.id,
    reaction.message.channel.id,
    reaction.message.id
  );

  if (messageId === undefined) {
    return;
  }

  const reactions = getReactions(reaction.message.guild.id, messageId);
  const emoji = reaction.emoji;
  let emojiRepresentation = "";

  if (emoji.id) {
    // Non-Unicode
    const a = emoji.animated === true;
    emojiRepresentation = `<${a ? "a" : ""}:${emoji.name}:${emoji.id}>`;
  } else {
    // Unicode
    emojiRepresentation = emoji.name!;
  }

  const reactionRole = reactions.find((x) => x.emoji === emojiRepresentation);

  if (!reactionRole) {
    console.warn(`reaction role not found for ${emojiRepresentation}`);
    return;
  }

  const guildMember = reaction.message.guild.members.cache.get(user.id);

  if (removed) {
    guildMember?.roles.remove(
      reactionRole?.role,
      `Reacted with ${emojiRepresentation}.`
    );
  } else {
    guildMember?.roles.add(
      reactionRole?.role,
      `Reacted with ${emojiRepresentation}.`
    );
  }
}
