import { Events, Interaction, ChatInputCommandInteraction, AutocompleteInteraction } from 'discord.js';

// Import commands
import * as enemyCommand from '../commands/enemy';
import * as playerCommand from '../commands/player';
import * as tradeCommand from '../commands/trade';

interface Command {
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
    autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>;
}

const commands = new Map<string, Command>([
    ['enemy', enemyCommand],
    ['player', playerCommand],
    ['trade', tradeCommand],
]);

/**
 * Interaction create event handler
 * Routes slash commands and autocomplete to appropriate handlers
 */
export const name = Events.InteractionCreate;
export const once = false;

export async function execute(interaction: Interaction): Promise<void> {
    // Handle slash commands
    if (interaction.isChatInputCommand()) {
        const command = commands.get(interaction.commandName);

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
        const command = commands.get(interaction.commandName);

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

export default { name, once, execute };
