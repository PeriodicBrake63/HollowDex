import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    AttachmentBuilder,
    EmbedBuilder,
} from 'discord.js';
import path from 'path';
import fs from 'fs';
import { loadEnemyList } from '../utils/database';
import { compileCard } from '../utils/cardCompiler';
import { config } from '../config';
import { EnemySpec } from '../types';

const enemyList = loadEnemyList();

/**
 * Enemy command group
 */
export const data = new SlashCommandBuilder()
    .setName('enemy')
    .setDescription('Enemy-related commands')
    .addSubcommand(subcommand =>
        subcommand
            .setName('inspect')
            .setDescription('Inspect an enemy by key or name')
            .addStringOption(option =>
                option
                    .setName('query')
                    .setDescription('Enemy key or display name')
                    .setRequired(true)
            )
    );

/**
 * Execute enemy commands
 */
export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'inspect') {
        await handleInspect(interaction);
    }
}

/**
 * Handle /enemy inspect command
 */
async function handleInspect(interaction: ChatInputCommandInteraction): Promise<void> {
    let query = interaction.options.getString('query', true);

    // Clean up query
    query = query.toLowerCase().trim();
    if (query.includes(',')) {
        query = query.split(',')[0].trim();
    }
    if (query.includes('#')) {
        query = query.split('#')[0].trim();
    }
    query = query.replace('enemy ', '').trim();

    // Find enemy by exact match first
    let found: [string, EnemySpec] | null = null;

    for (const [key, spec] of Object.entries(enemyList)) {
        if (key.toLowerCase() === query || spec.name.toLowerCase() === query) {
            found = [key, spec];
            break;
        }
    }

    // If no exact match, try partial match
    if (!found) {
        for (const [key, spec] of Object.entries(enemyList)) {
            if (key.toLowerCase().includes(query) || spec.name.toLowerCase().includes(query)) {
                found = [key, spec];
                break;
            }
        }
    }

    if (!found) {
        await interaction.reply(`Enemy '${query}' not found.`);
        return;
    }

    const [key, spec] = found;
    const name = spec.name;
    const hp = spec.health;
    const atk = spec.attack;
    const ability = spec.ability;

    const descParts = [`HP: ${hp}`, `ATK: ${atk}`];
    if (ability !== 0 && typeof ability === 'object') {
        descParts.push(`Ability: ${JSON.stringify(ability)}`);
    }

    // Try to generate card image
    let imgFile: string | null = null;
    try {
        const tmpDir = config.tempDir;
        if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir, { recursive: true });
        }

        const outName = `${key.replace(/ /g, '_')}_card.png`;
        const outPath = path.join(tmpDir, outName);

        await compileCard(spec, outPath);

        if (fs.existsSync(outPath)) {
            imgFile = outPath;
        }
    } catch (error) {
        console.error('Card compilation error:', error);
    }

    const embed = new EmbedBuilder()
        .setTitle(name)
        .setDescription(descParts.join(' | '));

    if (imgFile && fs.existsSync(imgFile)) {
        try {
            const file = new AttachmentBuilder(imgFile, { name: path.basename(imgFile) });
            embed.setImage(`attachment://${path.basename(imgFile)}`);
            await interaction.reply({ embeds: [embed], files: [file] });
            return;
        } catch (error) {
            console.error('Failed to attach image:', error);
        }
    }

    await interaction.reply({ embeds: [embed] });
}

export default { data, execute };
