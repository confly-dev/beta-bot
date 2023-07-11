require("dotenv").config();
const { Client, Events, GatewayIntentBits } = require("discord.js");
const { getConfig } = require("@confly-dev/confly-js");
const { default: axios } = require("axios");

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

getConfig(process.env.CONFLY_TOKEN).then((confly) => {
  client.login(confly.token);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isCommand()) {
    if (interaction.commandName === "betakeygen") {
      const confly = await getConfig(process.env.CONFLY_TOKEN);

      const conflyUser = confly.users.find(
        (user) => user.userId == interaction.user.id
      );

      if (!conflyUser || !conflyUser.permissions.createBetaKeys) {
        interaction.reply({
          content: "You don't have permission to use this command!",
          ephemeral: true,
        });
        return;
      }

      const inputPrefix = interaction.options.getString("prefix") ?? "";
      const inputUses = interaction.options.getInteger("uses") ?? 1;

      const { key, uses } = await generateBetaKey(
        inputPrefix,
        inputUses,
        confly.conflyToken
      );

      interaction.reply({
        content: `Here is your beta key: \`${key}\` with ${uses} uses.`,
        ephemeral: true,
      });
    }
  }
});

async function generateBetaKey(prefix, uses, conflyToken) {
  console.log(conflyToken);

  const response = await axios.post(
    "https://confly.dev/api/v1/internal/betakey",
    {
      prefix,
      uses,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${conflyToken}`,
      },
    }
  );

  console.log(response.data, response.status);

  const data = response.data;

  // console.log(data);

  return data;
}
