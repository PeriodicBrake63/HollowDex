import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, TextChannel } from 'discord.js';
import { spawnEnemy } from '../utils/spawnHandler';

export const data = new SlashCommandBuilder()
    .setName('debug')
    .setDescription('Debug commands for admin use')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(subcommand =>
        subcommand
            .setName('spawn')
            .setDescription('Force spawn an enemy in the current channel')
    );

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'spawn') {
        const channel = interaction.channel as TextChannel;

        if (!channel || !channel.isTextBased()) {
            await interaction.reply({ content: 'Cannot spawn in this channel type.', ephemeral: true });
            return;
        }

        try {
            await interaction.deferReply({ ephemeral: true }); // Hide the command trigger
            await spawnEnemy(channel, true); // Force spawn
            await interaction.editReply({ content: '✅ Forced enemy spawn.' });
        } catch (error) {
            console.error('Debug spawn error:', error);
            await interaction.editReply({ content: 'Failed to force spawn.' });
        }
    }
}
