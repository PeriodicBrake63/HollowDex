"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const config_1 = require("../config");
/**
 * Utility script to clear all registered slash commands
 * Run with: npm run clear-commands
 */
async function clearCommands() {
    const client = new discord_js_1.Client({ intents: [discord_js_1.GatewayIntentBits.Guilds] });
    const rest = new discord_js_1.REST().setToken(config_1.config.token);
    console.log('Logging in to Discord...');
    await client.login(config_1.config.token);
    console.log(`Logged in as ${client.user?.tag}`);
    try {
        // Get application ID
        const appId = client.application?.id;
        if (!appId) {
            throw new Error('Could not get application ID');
        }
        console.log('Fetching global commands...');
        // Fetch existing commands
        const existingCommands = await rest.get(discord_js_1.Routes.applicationCommands(appId));
        console.log(`Found ${existingCommands.length} global commands`);
        // Delete each command
        for (const cmd of existingCommands) {
            console.log(`Deleting command: ${cmd.name}`);
            await rest.delete(discord_js_1.Routes.applicationCommand(appId, cmd.id));
            console.log(`Deleted global command ${cmd.name}`);
        }
        // Clear guild commands if GUILD_ID is set
        if (config_1.config.guildId) {
            console.log(`\nFetching guild commands for ${config_1.config.guildId}...`);
            const guildCommands = await rest.get(discord_js_1.Routes.applicationGuildCommands(appId, config_1.config.guildId));
            console.log(`Found ${guildCommands.length} guild commands`);
            for (const cmd of guildCommands) {
                console.log(`Deleting guild command: ${cmd.name}`);
                await rest.delete(discord_js_1.Routes.applicationGuildCommand(appId, config_1.config.guildId, cmd.id));
                console.log(`Deleted guild command ${cmd.name}`);
            }
        }
        console.log('\nAll commands cleared successfully!');
    }
    catch (error) {
        console.error('Error clearing commands:', error);
    }
    finally {
        await client.destroy();
        process.exit(0);
    }
}
clearCommands();
//# sourceMappingURL=clearCommands.js.map