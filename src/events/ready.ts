import { Events } from 'discord.js';
import { client } from '../client';
import { startBackupLoop, resyncServs } from '../utils/sync';
export const name = Events.ClientReady;
export const once = true;

export async function execute(): Promise<void> {
    console.log(`Bot is online as ${client.user?.tag}`);
    await resyncServs();
    startBackupLoop();
    console.log('Ready event completed');
}
export default { name, once, execute };
