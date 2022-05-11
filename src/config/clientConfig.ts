import { existsSync, readFileSync, writeFileSync } from "fs";

export type ReactionRole = {
  emoji: string;
  role: string;
};

export type MessageReactionSettings = {
  channel: string;
  messageid: string;
  id: number;
  reactions: ReactionRole[];
};

export type GuildConfig = {
  guildid: string;
  messageReactions: MessageReactionSettings[];
};

export type ClientConfig = {
  guilds: GuildConfig[];
};

export let config: ClientConfig;

export function getGuildConfig(guild: string): GuildConfig {
  var cfg = config.guilds.find((g) => g.guildid == guild);

  if (!cfg) {
    return makeGuild(guild);
  }

  return cfg;
}

export function getMessageIdFromId(guild: string, id: number) {
  const cfg = getGuildConfig(guild);
  const message = cfg.messageReactions.find((m) => m.id == id);

  if (!message) {
    return null;
  }

  return message;
}

export function addReaction(
  guild: string,
  messageId: number,
  reaction: ReactionRole
) {
  const guildConfig = getGuildConfig(guild);
  const gIndex = config.guilds.indexOf(guildConfig);
  const mIndex = guildConfig.messageReactions.findIndex(
    (m) => m.id == messageId
  );

  config.guilds[gIndex].messageReactions[mIndex].reactions.push(reaction);
}

export function getReactions(guild: string, messageId: number): ReactionRole[] {
  const guildConfig = getGuildConfig(guild);
  const messageReaction = guildConfig.messageReactions.find(
    (x) => x.id == messageId
  );

  if (!messageReaction) {
    return [];
  }

  console.log("yes");
  return messageReaction.reactions;
}

export function getMessageId(
  guild: string,
  channel: string,
  message: string
): number | undefined {
  const guildConfig = getGuildConfig(guild);

  if (!guildConfig) {
    makeGuild(guild);
    return getMessageId(guild, channel, message);
  }

  const messageReaction = guildConfig.messageReactions.find(
    (m) => m.channel == channel && m.messageid == message
  );

  if (messageReaction) {
    return messageReaction.id;
  }

  return undefined;
}

export function makeMessageId(
  guild: string,
  channel: string,
  message: string
): number {
  const guildConfig = getGuildConfig(guild);

  if (!guildConfig) {
    makeGuild(guild);
    return makeMessageId(guild, channel, message);
  }

  var id = guildConfig.messageReactions.length;

  guildConfig.messageReactions.push({
    channel: channel,
    messageid: message,
    id: id,
    reactions: [],
  });

  return id;
}

export async function configInit() {
  setConfig();
  setTimeout(() => {
    saveConfig();
  }, 1000 * 60 * 5);
}

function makeGuild(guild: string) {
  const newGuild = { guildid: guild, messageReactions: [] };
  config.guilds.push(newGuild);
  return newGuild;
}

function setConfig() {
  if (existsSync("config.json")) {
    config = JSON.parse(readFileSync("config.json", "utf8"));
    return;
  }

  config = {
    guilds: [],
  };
  saveConfig();
}

export function saveConfig() {
  writeFileSync("config.json", JSON.stringify(config));
}
