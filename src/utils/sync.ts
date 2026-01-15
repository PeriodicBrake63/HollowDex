import { exec } from 'child_process';
import { promisify } from 'util';
import { config } from '../config';
import { client } from '../client';
import { saveServerBase, savePlayerBase } from './database';

const execAsync = promisify(exec);

/**
 * Execute git sync operations
 */
async function gitSync(): Promise<void> {
    const cwd = config.repoDir;

    try {
        await execAsync('git add .', { cwd });
        await execAsync('git commit -m "HollowDex runtime DB sync"', { cwd });
        await execAsync('git pull', { cwd });
        await execAsync('git push', { cwd });
    } catch (error) {
        // Git operations may fail if no changes, which is fine
        console.log('Git sync completed (or no changes to sync)');
    }
}

/**
 * Resync server configurations
 * Updates ServerBase with any new guilds the bot has joined
 */
export async function resyncServs(): Promise<void> {
    for (const guild of client.guilds.cache.values()) {
        const guildId = guild.id;
        if (!(guildId in client.serverBase)) {
            client.serverBase[guildId] = {
                spawn_ch: null,
                disabled: true,
            };
        }
    }

    // Save to files
    saveServerBase(client.serverBase);
    savePlayerBase(client.playerBase);

    // Sync with git
    await gitSync();
}

/**
 * Start the backup loop
 * Runs every 120 seconds to sync database changes
 */
export async function startBackupLoop(): Promise<void> {
    const BACKUP_INTERVAL = 120 * 1000; // 120 seconds in milliseconds

    const runBackup = async () => {
        try {
            await resyncServs();
        } catch (error) {
            console.error('Backup loop error:', error);
        }
    };

    // Run immediately on start
    await runBackup();

    // Then run on interval
    setInterval(runBackup, BACKUP_INTERVAL);
}

export default { resyncServs, startBackupLoop };
