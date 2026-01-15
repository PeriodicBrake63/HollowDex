"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
exports.execute = execute;
const discord_js_1 = require("discord.js");
/**
 * Player command group
 */
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('player')
    .setDescription('Player commands')
    .addSubcommand(subcommand => subcommand
    .setName('init')
    .setDescription('Initializes a player as a collector')
    .addUserOption(option => option
    .setName('user')
    .setDescription('User to initialize')
    .setRequired(true)))
    .addSubcommand(subcommand => subcommand
    .setName('config')
    .setDescription('Opens the config panel')
    .addStringOption(option => option
    .setName('enemy')
    .setDescription('Enemy to configure')
    .setRequired(true)));
/**
 * Execute player commands
 */
async function execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    if (subcommand === 'init') {
        await handleInit(interaction);
    }
    else if (subcommand === 'config') {
        await handleConfig(interaction);
    }
}
/**
 * Handle /player init command
 */
async function handleInit(interaction) {
    const user = interaction.options.getUser('user', true);
    // Placeholder implementation (matches original Python behavior)
    await interaction.reply({
        content: `*act like your account is initialized while it's really not in database*`,
        ephemeral: true,
    });
}
/**
 * Handle /player config command
 */
async function handleConfig(interaction) {
    const enemy = interaction.options.getString('enemy', true);
    // Placeholder implementation (matches original Python behavior)
    await interaction.reply({
        content: `*act like this opened the config panel*`,
        ephemeral: true,
    });
}
exports.default = { data: exports.data, execute };
//# sourceMappingURL=player.js.map