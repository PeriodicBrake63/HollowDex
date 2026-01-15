import { REST, Routes, Client, GatewayIntentBits } from 'discord.js';
import { config } from '../config';

/**
 * Utility script to clear all registered slash commands
 * Run with: npm run clear-commands
 */
async function clearCommands(): Promise<void> {
    const client = new Client({ intents: [GatewayIntentBits.Guilds] });
    const rest = new REST().setToken(config.token);

    console.log('Logging in to Discord...');
    await client.login(config.token);

    console.log(`Logged in as ${client.user?.tag}`);

    try {
        // Get application ID
        const appId = client.application?.id;
        if (!appId) {
            throw new Error('Could not get application ID');
        }

        console.log('Fetching global commands...');

        // Fetch existing commands
        const existingCommands = await rest.get(
            Routes.applicationCommands(appId)
        ) as Array<{ id: string; name: string }>;

        console.log(`Found ${existingCommands.length} global commands`);

        // Delete each command
        for (const cmd of existingCommands) {
            console.log(`Deleting command: ${cmd.name}`);
            await rest.delete(Routes.applicationCommand(appId, cmd.id));
            console.log(`Deleted global command ${cmd.name}`);
        }

        // Clear guild commands if GUILD_ID is set
        if (config.guildId) {
            console.log(`\nFetching guild commands for ${config.guildId}...`);

            const guildCommands = await rest.get(
                Routes.applicationGuildCommands(appId, config.guildId)
            ) as Array<{ id: string; name: string }>;

            console.log(`Found ${guildCommands.length} guild commands`);

            for (const cmd of guildCommands) {
                console.log(`Deleting guild command: ${cmd.name}`);
                await rest.delete(
                    Routes.applicationGuildCommand(appId, config.guildId, cmd.id)
                );
                console.log(`Deleted guild command ${cmd.name}`);
            }
        }

        console.log('\nAll commands cleared successfully!');
    } catch (error) {
        console.error('Error clearing commands:', error);
    } finally {
        await client.destroy();
        process.exit(0);
    }
}

clearCommands();
