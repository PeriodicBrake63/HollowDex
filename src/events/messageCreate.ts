import { Events, Message, AttachmentBuilder, TextChannel, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import path from 'path';
import fs from 'fs';
import { client } from '../client';
import { loadEnemyList } from '../utils/database';
import { config } from '../config';
import { EnemySpec } from '../types';

const enemyList = loadEnemyList();

// In-memory active spawns map
export const activeSpawns = new Map<string, { enemyKey: string; spawnedAt: Date; caughtBy: string | null }>();

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

        // Create catch button
        const catchButton = new ButtonBuilder()
            .setCustomId(`catch_${chosenKey}`)
            .setLabel('Catch')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('🕸️');

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(catchButton);

        // Try to find the enemy image
        const imgPath = path.join(
            config.assetsDir,
            'enemies',
            chosenSpec.category,
            `${chosenSpec.name}.png`
        );

        // Get spawn channel (use spawn_channel_id or spawn_ch)
        const spawnChannelId = serverConfig.spawn_channel_id || serverConfig.spawn_ch;
        let spawnMsg: Message | null = null;

        if (!spawnChannelId) {
            // No spawn channel configured, send in current channel
            const channel = message.channel as TextChannel;
            if (fs.existsSync(imgPath)) {
                const file = new AttachmentBuilder(imgPath);
                spawnMsg = await channel.send({ content: spawnMessage, files: [file], components: [row] });
            } else {
                spawnMsg = await channel.send({ content: spawnMessage, components: [row] });
            }
        } else {
            // Send to configured spawn channel
            const channel = message.guild.channels.cache.get(spawnChannelId);
            if (channel && channel.isTextBased() && 'send' in channel) {
                const textChannel = channel as TextChannel;
                if (fs.existsSync(imgPath)) {
                    const file = new AttachmentBuilder(imgPath);
                    spawnMsg = await textChannel.send({ content: spawnMessage, files: [file], components: [row] });
                } else {
                    spawnMsg = await textChannel.send({ content: spawnMessage, components: [row] });
                }
            }
        }

        // Register spawn in memory with message ID
        if (spawnMsg && chosenKey) {
            activeSpawns.set(spawnMsg.id, {
                enemyKey: chosenKey,
                spawnedAt: new Date(),
                caughtBy: null
            });

            // Cleanup spawn data after 5 minutes
            setTimeout(() => {
                if (spawnMsg) {
                    activeSpawns.delete(spawnMsg.id);
                    // Disable button after timeout
                    const disabledRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
                        ButtonBuilder.from(catchButton).setDisabled(true).setLabel('Fled')
                    );
                    spawnMsg.edit({ components: [disabledRow] }).catch(() => { });
                }
            }, 5 * 60 * 1000);
        }

    } catch (error) {
        // Silently fail to not interrupt normal message flow
        console.error('Spawn error:', error);
    }
}

export default { name, once, execute };
