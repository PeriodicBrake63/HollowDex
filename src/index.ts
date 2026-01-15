import { config } from './config';
import { client } from './client';
import { loadCommands, registerCommandsIfChanged } from './utils/commandLoader';

// Import events
import * as readyEvent from './events/ready';
import * as messageCreateEvent from './events/messageCreate';
import * as interactionCreateEvent from './events/interactionCreate';

/**
 * Register event handlers
 */
function registerEvents(): void {
    // Ready event (once)
    if (readyEvent.once) {
        client.once(readyEvent.name, async (...args) => {
            await readyEvent.execute();
            // Commands are now registered in main() before login or during init, 
            // but we can also trigger a check here if we want to ensure client is ready.
            // However, with the new loader, we can do it independently.
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

    // Load commands
    const commands = await loadCommands();
    console.log(`Loaded ${commands.length} commands.`);

    // Attach commands to client for interaction handler
    (client as any).commands = new Map();
    for (const cmd of commands) {
        (client as any).commands.set(cmd.data.name, cmd);
    }

    // Register event handlers
    registerEvents();

    // Login to Discord
    await client.login(config.token);

    // Register commands if changed (after login to ensure we have application ID)
    // We need to wait for client to be ready to get application ID, 
    // OR we can rely on the ready event.
    // Let's do it in the ready handler ideally, or wait here.
    // Waiting here is tricky because login is async but doesn't resolve with ready.
    // Let's move registration to the ready event or a separate init function.

    // Actually, client.application is available after ready.
    // Let's use the ready event for registration safety.
    client.once('ready', async () => {
        await registerCommandsIfChanged(commands);
    });
}

// Run the bot
main().catch(console.error);
