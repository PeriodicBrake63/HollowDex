///  TO DO: uh I WILL be refractoring this event into other delegated files once i get the logic sound and right
import { DiscordjsTypeError, Events, Message, TextChannel } from 'discord.js';
import { client } from '../client';
import { spawnEnemy } from '../utils/spawnHandler';

/**
 * Message create event handler
 * Handles random enemy spawns in configured channels
 */
export const name = Events.MessageCreate;
export const once = false;

export async function execute(message: Message): Promise<void> {
    // Ignore bot messages
    if (message.author.id === client.user?.id) {
        return;
    }
    // Ignore DMs
    if (!message.guild) {
        return;
    }
    try {
        const guildId = message.guild.id;
        const serverConfig = client.serverBase[guildId];

        if (!serverConfig) {
            return;
        }

        // Get spawn channel (use spawn_channel_id or spawn_ch)
        const spawnChannelId = serverConfig.spawn_channel_id || serverConfig.spawn_ch;
        let targetChannel: TextChannel | null = null;

        if (!spawnChannelId) {
            // No spawn channel configured, send in current channel
            targetChannel = message.channel as TextChannel;
        } else {
            // Send to configured spawn channel
            const channel = message.guild.channels.cache.get(spawnChannelId);
            if (channel && channel.isTextBased() && 'send' in channel) {
                targetChannel = channel as TextChannel;
            }
        }

        if (targetChannel) {
            // Attempt spawn (handled by utility with rate check)
            await spawnEnemy(targetChannel);
        }

    } catch (error: any) { // we wont use "any" cz unknown is safe in new typescr? alr so we shall do instanceof
        if (error instanceof Error) {
            console.error('Spawn error:', error.stack); // we want full stack of error for debugs :)
        }
        console.error('Spawn error:', error); // still catch non error types like idk strings?
    }
}

export default { name, once, execute };
