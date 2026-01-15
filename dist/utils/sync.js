"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resyncServs = resyncServs;
exports.startBackupLoop = startBackupLoop;
const child_process_1 = require("child_process");
const util_1 = require("util");
const config_1 = require("../config");
const client_1 = require("../client");
const database_1 = require("./database");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
/**
 * Execute git sync operations
 */
async function gitSync() {
    const cwd = config_1.config.repoDir;
    try {
        await execAsync('git add .', { cwd });
        await execAsync('git commit -m "major changes by @laxenta"', { cwd });
        await execAsync('git pull', { cwd });
        await execAsync('git push', { cwd });
    }
    catch (error) {
        // Git operations may fail if no changes, which is fine
        console.log('Git sync completed (or no changes to sync)');
    }
}
/**
 * Resync server configurations
 * Updates ServerBase with any new guilds the bot has joined
 */
async function resyncServs() {
    for (const guild of client_1.client.guilds.cache.values()) {
        const guildId = guild.id;
        if (!(guildId in client_1.client.serverBase)) {
            client_1.client.serverBase[guildId] = {
                spawn_ch: null,
                disabled: true,
            };
        }
    }
    // Save to files
    (0, database_1.saveServerBase)(client_1.client.serverBase);
    (0, database_1.savePlayerBase)(client_1.client.playerBase);
    // Sync with git
    await gitSync();
}
/**
 * Start the backup loop
 * Runs every 120 seconds to sync database changes
 */
async function startBackupLoop() {
    const BACKUP_INTERVAL = 120 * 1000; // 120 seconds in milliseconds
    const runBackup = async () => {
        try {
            await resyncServs();
        }
        catch (error) {
            console.error('Backup loop error:', error);
        }
    };
    // Run immediately on start
    await runBackup();
    // Then run on interval
    setInterval(runBackup, BACKUP_INTERVAL);
}
exports.default = { resyncServs, startBackupLoop };
//# sourceMappingURL=sync.js.map