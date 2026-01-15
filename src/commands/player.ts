import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
} from 'discord.js';

/**
 * Player command group
 */
export const data = new SlashCommandBuilder()
    .setName('player')
    .setDescription('Player commands')
    .addSubcommand(subcommand =>
        subcommand
            .setName('init')
            .setDescription('Initializes a player as a collector')
            .addUserOption(option =>
                option
                    .setName('user')
                    .setDescription('User to initialize')
                    .setRequired(true)
            )
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('config')
            .setDescription('Opens the config panel')
            .addStringOption(option =>
                option
                    .setName('enemy')
                    .setDescription('Enemy to configure')
                    .setRequired(true)
            )
    );

/**
 * Execute player commands
 */
export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'init') {
        await handleInit(interaction);
    } else if (subcommand === 'config') {
        await handleConfig(interaction);
    }
}

/**
 * Handle /player init command
 */
async function handleInit(interaction: ChatInputCommandInteraction): Promise<void> {
    const user = interaction.options.getUser('user', true);

    // Placeholder implementation (matches original Python behavior)
    await interaction.reply({
        content: `*act like your account is initialized while it's really not in database*`,
        ephemeral: true,
    });
}

/**
 * Handle /player config command
 */
async function handleConfig(interaction: ChatInputCommandInteraction): Promise<void> {
    const enemy = interaction.options.getString('enemy', true);

    // Placeholder implementation (matches original Python behavior)
    await interaction.reply({
        content: `*act like this opened the config panel*`,
        ephemeral: true,
    });
}

export default { data, execute };
