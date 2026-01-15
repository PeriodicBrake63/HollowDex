import { Message, AttachmentBuilder, TextChannel, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import path from 'path';
import fs from 'fs';
import { client } from '../client';
import { loadEnemyList } from './database';
import { config } from '../config';
import { EnemySpec } from '../types';
import { activeSpawns } from '../events/messageCreate';

const enemyList = loadEnemyList();

/**
 * Handle enemy spawn logic
 * @param channel The channel to spawn in
 * @param force Whether to bypass random chance and config checks (for debug)
 */
export async function spawnEnemy(channel: TextChannel, force: boolean = false): Promise<void> {
    const guildId = channel.guild.id;
    const serverConfig = client.serverBase[guildId];

    if (!serverConfig && !force) {
        return;
    }

    // 1% chance check (skip if forced)
    if (!force && Math.random() * 100 > 1) {
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

    let spawnMsg: Message | null = null;

    // Send message
    if (fs.existsSync(imgPath)) {
        const file = new AttachmentBuilder(imgPath);
        spawnMsg = await channel.send({ content: spawnMessage, files: [file], components: [row] });
    } else {
        spawnMsg = await channel.send({ content: spawnMessage, components: [row] });
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
}
