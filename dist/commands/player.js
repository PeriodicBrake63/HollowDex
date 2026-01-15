"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
exports.execute = execute;
const discord_js_1 = require("discord.js");
const client_1 = require("../client");
const database_1 = require("../utils/database");
const playerUtils_1 = require("../utils/playerUtils");
const enemyList = (0, database_1.loadEnemyList)();
/**
 * Player command group
 */
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('player')
    .setDescription('Player commands')
    .addSubcommand(subcommand => subcommand
    .setName('init')
    .setDescription('Initialize your player account and start collecting'))
    .addSubcommand(subcommand => subcommand
    .setName('stats')
    .setDescription('View your player statistics')
    .addUserOption(option => option
    .setName('user')
    .setDescription('User to view stats for (defaults to you)')
    .setRequired(false)))
    .addSubcommand(subcommand => subcommand
    .setName('collection')
    .setDescription('View your enemy collection')
    .addUserOption(option => option
    .setName('user')
    .setDescription('User to view collection for (defaults to you)')
    .setRequired(false)));
/**
 * Execute player commands
 */
async function execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    if (subcommand === 'init') {
        await handleInit(interaction);
    }
    else if (subcommand === 'stats') {
        await handleStats(interaction);
    }
    else if (subcommand === 'collection') {
        await handleCollection(interaction);
    }
}
/**
 * Handle /player init command
 */
async function handleInit(interaction) {
    const userId = interaction.user.id;
    // Check if already initialized
    if (client_1.client.playerBase[userId]) {
        await interaction.reply({
            content: 'You are already initialized as a collector.',
            ephemeral: true,
        });
        return;
    }
    try {
        (0, playerUtils_1.initializePlayer)(userId);
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle('Welcome to HollowDex')
            .setDescription(`${interaction.user.username}, you are now a collector.\n\n` +
            'You have been given 3 Crawlids to start your journey.\n\n' +
            'Enemies will randomly spawn in configured channels. Click the Catch button to attempt to capture them.\n\n' +
            'Use `/player collection` to view your collection.\n' +
            'Use `/player stats` to view your statistics.');
        await interaction.reply({ embeds: [embed] });
    }
    catch (error) {
        await interaction.reply({
            content: 'Failed to initialize player. Please try again.',
            ephemeral: true,
        });
    }
}
/**
 * Handle /player stats command
 */
async function handleStats(interaction) {
    const targetUser = interaction.options.getUser('user') || interaction.user;
    const userId = targetUser.id;
    const stats = (0, playerUtils_1.getPlayerStats)(userId);
    if (!stats) {
        await interaction.reply({
            content: `${targetUser.username} has not initialized their account yet.`,
            ephemeral: true,
        });
        return;
    }
    const nextLevelXp = Math.pow(stats.level + 1, 2) * 100;
    const xpToNext = nextLevelXp - stats.xp;
    const embed = new discord_js_1.EmbedBuilder()
        .setTitle(`${targetUser.username}'s Statistics`)
        .addFields({ name: 'Level', value: String(stats.level), inline: true }, { name: 'XP', value: `${stats.xp} / ${nextLevelXp}`, inline: true }, { name: 'XP to Next Level', value: String(xpToNext), inline: true }, { name: 'Total Enemies', value: String(stats.totalEnemies), inline: true }, { name: 'Unique Types', value: String(stats.uniqueEnemies), inline: true });
    await interaction.reply({ embeds: [embed] });
}
/**
 * Handle /player collection command
 */
async function handleCollection(interaction) {
    const targetUser = interaction.options.getUser('user') || interaction.user;
    const userId = targetUser.id;
    const playerData = client_1.client.playerBase[userId];
    if (!playerData) {
        await interaction.reply({
            content: `${targetUser.username} has not initialized their account yet.`,
            ephemeral: true,
        });
        return;
    }
    if (playerData.enemies.length === 0) {
        await interaction.reply({
            content: `${targetUser.username} has no enemies in their collection.`,
            ephemeral: true,
        });
        return;
    }
    // Group enemies by type and count
    const enemyCounts = new Map();
    for (const enemy of playerData.enemies) {
        enemyCounts.set(enemy.enemyKey, (enemyCounts.get(enemy.enemyKey) || 0) + 1);
    }
    // Build collection display
    const lines = [];
    for (const [enemyKey, count] of enemyCounts.entries()) {
        const spec = enemyList[enemyKey];
        const name = spec?.name || enemyKey;
        lines.push(`${name} x${count}`);
    }
    const embed = new discord_js_1.EmbedBuilder()
        .setTitle(`${targetUser.username}'s Collection`)
        .setDescription(`Total: ${playerData.enemies.length} enemies\n` +
        `Unique: ${enemyCounts.size} types\n\n` +
        lines.join('\n'));
    await interaction.reply({ embeds: [embed] });
}
exports.default = { data: exports.data, execute };
//# sourceMappingURL=player.js.map