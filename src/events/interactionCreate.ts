import { Events, Interaction, ChatInputCommandInteraction, AutocompleteInteraction, ButtonInteraction } from 'discord.js';
import { activeSpawns } from './messageCreate';
import { attemptCatch, addEnemyToCollection } from '../utils/playerUtils';
import { loadEnemyList as loadDbEnemyList } from '../utils/database';
import { client } from '../client';
import { Command } from '../types';

const enemyList = loadDbEnemyList();

/**
 * Interaction create event handler
 * Routes slash commands and autocomplete to appropriate handlers
 */
export const name = Events.InteractionCreate;
export const once = false;

export async function execute(interaction: Interaction): Promise<void> {
    // Handle button interactions (Catch system)
    if (interaction.isButton()) {
        const customId = interaction.customId;

        if (customId.startsWith('catch_')) {
            await handleCatch(interaction);
        }
        return;
    }

    // Handle slash commands
    if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(`Error executing ${interaction.commandName}:`, error);

            const errorMessage = 'There was an error while executing this command!';

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: errorMessage, ephemeral: true });
            } else {
                await interaction.reply({ content: errorMessage, ephemeral: true });
            }
        }
    }

    // Handle autocomplete
    if (interaction.isAutocomplete()) {
        const command = client.commands.get(interaction.commandName);

        if (!command || !command.autocomplete) {
            return;
        }

        try {
            await command.autocomplete(interaction);
        } catch (error) {
            console.error(`Autocomplete error for ${interaction.commandName}:`, error);
        }
    }
}

/**
 * Handle catch button interaction
 */
async function handleCatch(interaction: ButtonInteraction): Promise<void> {
    const messageId = interaction.message.id;
    const spawnData = activeSpawns.get(messageId);

    if (!spawnData) {
        await interaction.reply({
            content: 'This enemy has fled or is no longer available.',
            ephemeral: true
        });
        return;
    }

    if (spawnData.caughtBy) {
        await interaction.reply({
            content: 'This enemy has already been caught!',
            ephemeral: true
        });
        return;
    }

    // Check if player is initialized
    try {
        addEnemyToCollection(interaction.user.id, 'check_only');
    } catch (e: any) {
        if (e.message === 'Player not initialized') {
            await interaction.reply({
                content: 'You cannot catch enemies yet! Use `/player init` to start your adventure.',
                ephemeral: true
            });
            return;
        }
        // Other errors ignored as we're just checking init status
    }

    // Try to catch
    const userId = interaction.user.id;
    const enemyKey = spawnData.enemyKey;
    const isCaught = attemptCatch(enemyKey);

    if (isCaught) {
        try {
            spawnData.caughtBy = userId;
            const enemy = addEnemyToCollection(userId, enemyKey);
            const enemySpec = enemyList[enemyKey];
            const enemyName = enemySpec ? enemySpec.name : enemyKey;

            await interaction.reply({
                content: `🎉 Gotcha! **${interaction.user.username}** caught a wild **${enemyName}**! (+XP)`,
            });

            // In a real scenario you might update the message to remove the button
        } catch (error: any) {
            console.error('Catch error:', error);
            await interaction.reply({
                content: 'Something went wrong while catching.',
                ephemeral: true
            });
            spawnData.caughtBy = null; // Reset on error
        }
    } else {
        await interaction.reply({
            content: `The ${enemyKey} dodged your attempt! try again!`,
            ephemeral: true
        });
    }
}

export default { name, once, execute };
