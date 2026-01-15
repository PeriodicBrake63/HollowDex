import { REST, Routes } from 'discord.js';
import { config } from './config';
import { client } from './client';

// Import commands
import * as enemyCommand from './commands/enemy';
import * as playerCommand from './commands/player';
import * as tradeCommand from './commands/trade';

// Import events
import * as readyEvent from './events/ready';
import * as messageCreateEvent from './events/messageCreate';
import * as interactionCreateEvent from './events/interactionCreate';

const commands = [
    enemyCommand.data.toJSON(),
    playerCommand.data.toJSON(),
    tradeCommand.data.toJSON(),
];

/**
 * Register slash commands with Discord
 */
async function registerCommands(): Promise<void> {
    const rest = new REST().setToken(config.token);

    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // Register commands globally
        const data = await rest.put(
            Routes.applicationCommands(client.application!.id),
            { body: commands }
        ) as unknown[];

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);

        // Log registered commands
        console.log('Synced commands:');
        for (const cmd of commands) {
            console.log(`- ${cmd.name}: ${cmd.description}`);
        }
    } catch (error) {
        console.error('Error registering commands:', error);
    }
}

/**
 * Register event handlers
 */
function registerEvents(): void {
    // Ready event (once)
    if (readyEvent.once) {
        client.once(readyEvent.name, async (...args) => {
            await readyEvent.execute();
            await registerCommands();
        });
    }

    // Message create event
    client.on(messageCreateEvent.name, messageCreateEvent.execute);

    // Interaction create event
    client.on(interactionCreateEvent.name, interactionCreateEvent.execute);
}

/**
 * Main entry point
 */
async function main(): Promise<void> {
    console.log('Starting HollowDex bot...');

    // Register event handlers
    registerEvents();

    // Login to Discord
    await client.login(config.token);
}

// Run the bot
main().catch(console.error);
