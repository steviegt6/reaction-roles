import { BaseCommandInteraction, Client } from "discord.js";
import { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/v10";
import { AddMessage } from "./addMessageCommand";
import { SaveConfig } from "./saveConfigCommand";
import { AddRole } from "./addRoleCommand";
import { RefreshRoles } from "./refreshRoles";

export const registerdCommands: Command[] = [AddMessage, SaveConfig, AddRole, RefreshRoles];

export default interface Command {
  //  RESTPostAPIApplicationCommandsJSONBody
  data: RESTPostAPIApplicationCommandsJSONBody;
  execute: (client: Client, interaction: BaseCommandInteraction) => void;
}
