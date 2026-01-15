import { Events, Message, AttachmentBuilder, TextChannel } from 'discord.js';
import path from 'path';
import fs from 'fs';
import { client } from '../client';
import { loadEnemyList } from '../utils/database';
import { config } from '../config';
import { EnemySpec } from '../types';

const enemyList = loadEnemyList();

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

        let chosenKey: string | null = null;
        let chosenSpec: EnemySpec | null = null;

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

        // Try to find the enemy image
        const imgPath = path.join(
            config.assetsDir,
            'enemies',
            chosenSpec.category,
            `${chosenSpec.name}.png`
        );

        // Get spawn channel (use spawn_channel_id or spawn_ch)
        const spawnChannelId = serverConfig.spawn_channel_id || serverConfig.spawn_ch;

        if (!spawnChannelId) {
            // No spawn channel configured, send in current channel
            // Type assertion since we know this is a guild text channel
            const channel = message.channel as TextChannel;
            if (fs.existsSync(imgPath)) {
                const file = new AttachmentBuilder(imgPath);
                await channel.send({ content: spawnMessage, files: [file] });
            } else {
                await channel.send(spawnMessage);
            }
        } else {
            // Send to configured spawn channel
            const channel = message.guild.channels.cache.get(spawnChannelId);
            if (channel && channel.isTextBased() && 'send' in channel) {
                const textChannel = channel as TextChannel;
                if (fs.existsSync(imgPath)) {
                    const file = new AttachmentBuilder(imgPath);
                    await textChannel.send({ content: spawnMessage, files: [file] });
                } else {
                    await textChannel.send(spawnMessage);
                }
            }
        }
    } catch (error) {
        // Silently fail to not interrupt normal message flow
        console.error('Spawn error:', error);
    }
}

export default { name, once, execute };
