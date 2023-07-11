// Register slash commands
const { REST } = require("@discordjs/rest");

const { Routes } = require("discord-api-types/v9");

const { getConfig } = require("@confly-dev/confly-js");

const {
  Client,
  Events,
  GatewayIntentBits,
  SlashCommandBuilder,
} = require("discord.js");

require("dotenv").config();

const commands = [
  new SlashCommandBuilder()
    .setName("betakeygen")
    .setDescription("Generates a beta key")
    .addStringOption((option) =>
      option.setName("prefix").setDescription("The prefix for the key")
    )
    .addIntegerOption((option) =>
      option.setName("uses").setDescription("The amount of uses the key has")
    )
    .toJSON(),
];

(async () => {
  const confly = await getConfig(process.env.CONFLY_TOKEN);

  const rest = new REST({ version: "9" }).setToken(confly.token);

  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(
      Routes.applicationGuildCommands(confly.applicationId, confly.guildId),
      { body: commands }
    );

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();
