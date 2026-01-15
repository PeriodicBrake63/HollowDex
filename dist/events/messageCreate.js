"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.once = exports.name = exports.activeSpawns = void 0;
exports.execute = execute;
const discord_js_1 = require("discord.js");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const client_1 = require("../client");
const database_1 = require("../utils/database");
const config_1 = require("../config");
const enemyList = (0, database_1.loadEnemyList)();
// In-memory active spawns map
exports.activeSpawns = new Map();
/**
 * Message create event handler
 * Handles random enemy spawns in configured channels
 */
exports.name = discord_js_1.Events.MessageCreate;
exports.once = false;
async function execute(message) {
    // Ignore bot messages
    if (message.author.id === client_1.client.user?.id) {
        return;
    }
    // Ignore DMs
    if (!message.guild) {
        return;
    }
    try {
        const guildId = message.guild.id;
        const serverConfig = client_1.client.serverBase[guildId];
        if (!serverConfig) {
            return;
        }
        // 1% chance to spawn an enemy
        if (Math.random() * 100 > 1) {
            return;
        }
        // Get list of enemies and their weights (inverse of rarity)
        const enemies = Object.entries(enemyList);
        if (enemies.length === 0) {
            return;
        }
        // Weighted random selection
        const weights = enemies.map(([, spec]) => 1 / spec.rarity);
        const totalWeight = weights.reduce((a, b) => a + b, 0);
        let random = Math.random() * totalWeight;
        let chosenKey = null;
        let chosenSpec = null;
        for (let i = 0; i < enemies.length; i++) {
            random -= weights[i];
            if (random <= 0) {
                [chosenKey, chosenSpec] = enemies[i];
                break;
            }
        }
        // Fallback if selection fails
        if (!chosenKey || !chosenSpec) {
            const randomIndex = Math.floor(Math.random() * enemies.length);
            [chosenKey, chosenSpec] = enemies[randomIndex];
        }
        // Build spawn message
        const spawnMessage = `A wild ${chosenSpec.name} appears! HP: ${chosenSpec.health}, ATK: ${chosenSpec.attack}`;
        // Create catch button
        const catchButton = new discord_js_1.ButtonBuilder()
            .setCustomId(`catch_${chosenKey}`)
            .setLabel('Catch')
            .setStyle(discord_js_1.ButtonStyle.Primary)
            .setEmoji('🕸️');
        const row = new discord_js_1.ActionRowBuilder().addComponents(catchButton);
        // Try to find the enemy image
        const imgPath = path_1.default.join(config_1.config.assetsDir, 'enemies', chosenSpec.category, `${chosenSpec.name}.png`);
        // Get spawn channel (use spawn_channel_id or spawn_ch)
        const spawnChannelId = serverConfig.spawn_channel_id || serverConfig.spawn_ch;
        let spawnMsg = null;
        if (!spawnChannelId) {
            // No spawn channel configured, send in current channel
            const channel = message.channel;
            if (fs_1.default.existsSync(imgPath)) {
                const file = new discord_js_1.AttachmentBuilder(imgPath);
                spawnMsg = await channel.send({ content: spawnMessage, files: [file], components: [row] });
            }
            else {
                spawnMsg = await channel.send({ content: spawnMessage, components: [row] });
            }
        }
        else {
            // Send to configured spawn channel
            const channel = message.guild.channels.cache.get(spawnChannelId);
            if (channel && channel.isTextBased() && 'send' in channel) {
                const textChannel = channel;
                if (fs_1.default.existsSync(imgPath)) {
                    const file = new discord_js_1.AttachmentBuilder(imgPath);
                    spawnMsg = await textChannel.send({ content: spawnMessage, files: [file], components: [row] });
                }
                else {
                    spawnMsg = await textChannel.send({ content: spawnMessage, components: [row] });
                }
            }
        }
        // Register spawn in memory with message ID
        if (spawnMsg && chosenKey) {
            exports.activeSpawns.set(spawnMsg.id, {
                enemyKey: chosenKey,
                spawnedAt: new Date(),
                caughtBy: null
            });
            // Cleanup spawn data after 5 minutes
            setTimeout(() => {
                if (spawnMsg) {
                    exports.activeSpawns.delete(spawnMsg.id);
                    // Disable button after timeout
                    const disabledRow = new discord_js_1.ActionRowBuilder().addComponents(discord_js_1.ButtonBuilder.from(catchButton).setDisabled(true).setLabel('Fled'));
                    spawnMsg.edit({ components: [disabledRow] }).catch(() => { });
                }
            }, 5 * 60 * 1000);
        }
    }
    catch (error) {
        // Silently fail to not interrupt normal message flow
        console.error('Spawn error:', error);
    }
}
exports.default = { name: exports.name, once: exports.once, execute };
//# sourceMappingURL=messageCreate.js.map