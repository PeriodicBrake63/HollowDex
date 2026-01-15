"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.once = exports.name = void 0;
exports.execute = execute;
const discord_js_1 = require("discord.js");
const client_1 = require("../client");
const sync_1 = require("../utils/sync");
/**
 * Ready event handler
 * Called when the bot successfully connects to Discord
 */
exports.name = discord_js_1.Events.ClientReady;
exports.once = true;
async function execute() {
    console.log(`Bot is online as ${client_1.client.user?.tag}`);
    // Sync server database
    await (0, sync_1.resyncServs)();
    // Start backup loop (runs every 120 seconds)
    (0, sync_1.startBackupLoop)();
    console.log('Ready event completed');
}
exports.default = { name: exports.name, once: exports.once, execute };
//# sourceMappingURL=ready.js.map