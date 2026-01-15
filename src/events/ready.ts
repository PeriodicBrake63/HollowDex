import { Events } from 'discord.js';
import { client } from '../client';
import { startBackupLoop, resyncServs } from '../utils/sync';

/**
 * Ready event handler
 * Called when the bot successfully connects to Discord
 */
export const name = Events.ClientReady;
export const once = true;

export async function execute(): Promise<void> {
    console.log(`Bot is online as ${client.user?.tag}`);

    // Sync server database
    await resyncServs();

    // Start backup loop (runs every 120 seconds)
    startBackupLoop();

    console.log('Ready event completed');
}

export default { name, once, execute };
