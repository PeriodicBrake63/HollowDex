import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { REST, Routes, SlashCommandBuilder } from 'discord.js';
import { config } from '../config';
import { client } from '../client';
import { Command } from '../types';

/**
 * Recursively search for command files in a directory
 */
function findCommandFiles(dir: string, fileList: string[] = []): string[] {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            findCommandFiles(filePath, fileList);
        } else if (file.endsWith('.ts') || file.endsWith('.js')) {
            fileList.push(filePath);
        }
    }

    return fileList;
}

/**
 * Load all commands from the commands directory
 */
export async function loadCommands(): Promise<Command[]> {
    const commandsDir = path.join(__dirname, '../commands');
    const commandFiles = findCommandFiles(commandsDir);
    const commands: Command[] = [];

    for (const file of commandFiles) {
        try {
            // Import the command module
            // We use 'require' here to handle dynamic loading easily
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const commandModule = require(file);

            // Check if it has required properties
            const command = commandModule.default || commandModule;

            if (command?.data && command?.execute) {
                commands.push(command);
            } else if (commandModule.data && commandModule.execute) {
                // Support named exports if default export is not found/structured
                commands.push({
                    data: commandModule.data,
                    execute: commandModule.execute,
                    autocomplete: commandModule.autocomplete
                });
            } else {
                console.warn(`[WARNING] The command at ${file} is missing a required "data" or "execute" property.`);
            }
        } catch (error) {
            console.error(`Error loading command from ${file}:`, error);
        }
    }

    return commands;
}

/**
 * Register commands only if they have changed (based on hash)
 */
export async function registerCommandsIfChanged(commands: Command[]): Promise<void> {
    const commandsData = commands.map(cmd => cmd.data.toJSON());

    // Calculate SHA-256 hash of the command structures
    const hash = crypto
        .createHash('sha256')
        .update(JSON.stringify(commandsData))
        .digest('hex');

    const tempDir = path.join(__dirname, '../../Main/temp');
    const hashFile = path.join(tempDir, 'command_hash');

    // Ensure temp dir exists
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }

    let storedHash = '';
    if (fs.existsSync(hashFile)) {
        storedHash = fs.readFileSync(hashFile, 'utf-8');
    }

    if (hash === storedHash) {
        console.log('Commands are up to date. Skipping registration.');
        return;
    }

    console.log(`Command structure changed (Hash mismatch: ${hash.substring(0, 8)} vs ${storedHash.substring(0, 8)}). Registering commands...`);

    const rest = new REST().setToken(config.token);

    try {
        console.log(`Started refreshing ${commandsData.length} application (/) commands.`);

        const data = await rest.put(
            Routes.applicationCommands(client.application!.id),
            { body: commandsData }
        ) as unknown[];

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);

        // Save new hash
        fs.writeFileSync(hashFile, hash);

    } catch (error) {
        console.error('Error registering commands:', error);
    }
}
