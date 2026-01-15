import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    AutocompleteInteraction,
} from 'discord.js';
import { client } from '../client';

/**
 * Trade command group
 */
export const data = new SlashCommandBuilder()
    .setName('trade')
    .setDescription('Trade commands')
    .addSubcommand(subcommand =>
        subcommand
            .setName('begin')
            .setDescription('Starts a trade with another user')
            .addUserOption(option =>
                option
                    .setName('user')
                    .setDescription('User you want to trade with')
                    .setRequired(true)
            )
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('add')
            .setDescription('Adds an enemy to the current trade')
            .addStringOption(option =>
                option
                    .setName('enemy')
                    .setDescription('Enemy you want to add to the ongoing trade')
                    .setRequired(true)
                    .setAutocomplete(true)
            )
    );

/**
 * Execute trade commands
 */
export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'begin') {
        await handleBegin(interaction);
    } else if (subcommand === 'add') {
        await handleAdd(interaction);
    }
}

/**
 * Handle autocomplete for enemy selection
 */
export async function autocomplete(interaction: AutocompleteInteraction): Promise<void> {
    const focusedValue = interaction.options.getFocused().toLowerCase();
    const userId = interaction.user.id;

    const playerData = client.playerBase[userId];
    const enemies = playerData?.enemies || [];

    const choices = enemies.map((enemy, idx) => {
        const name = enemy.enemy_name || enemy.enemyName || 'unknown';
        const atk = enemy.atkMod ?? enemy.atk ?? 0;
        const def = enemy.defMod ?? enemy.def ?? 0;
        const hexIdx = idx.toString(16).toUpperCase().padStart(6, '0');
        return `${name}, ATK: ${atk}%, DEF: ${def}% #${hexIdx}`;
    });

    const filtered = choices
        .filter(choice => choice.toLowerCase().includes(focusedValue))
        .slice(0, 25); // Discord limits to 25 choices

    await interaction.respond(
        filtered.map(choice => ({ name: choice, value: choice }))
    );
}

/**
 * Handle /trade begin command
 */
async function handleBegin(interaction: ChatInputCommandInteraction): Promise<void> {
    const user = interaction.options.getUser('user', true);
    await interaction.reply(`Trade started with ${user.username}`);
}

/**
 * Handle /trade add command
 */
async function handleAdd(interaction: ChatInputCommandInteraction): Promise<void> {
    const enemy = interaction.options.getString('enemy', true);
    await interaction.reply(`Enemy '${enemy}' added to the ongoing trade`);
}

export default { data, execute, autocomplete };
