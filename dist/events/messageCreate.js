"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.once = exports.name = void 0;
exports.execute = execute;
const discord_js_1 = require("discord.js");
const client_1 = require("../client");
const spawnHandler_1 = require("../utils/spawnHandler");
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
        // Get spawn channel (use spawn_channel_id or spawn_ch)
        const spawnChannelId = serverConfig.spawn_channel_id || serverConfig.spawn_ch;
        let targetChannel = null;
        if (!spawnChannelId) {
            // No spawn channel configured, send in current channel
            targetChannel = message.channel;
        }
        else {
            // Send to configured spawn channel
            const channel = message.guild.channels.cache.get(spawnChannelId);
            if (channel && channel.isTextBased() && 'send' in channel) {
                targetChannel = channel;
            }
        }
        if (targetChannel) {
            // Attempt spawn (handled by utility with rate check)
            await (0, spawnHandler_1.spawnEnemy)(targetChannel);
        }
    }
    catch (error) {
        // Silently fail to not interrupt normal message flow
        console.error('Spawn error:', error);
    }
}
exports.default = { name: exports.name, once: exports.once, execute };
//# sourceMappingURL=messageCreate.js.map