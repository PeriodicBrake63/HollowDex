import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

interface Config {
    token: string;
    guildId: string | null;
    databaseDir: string;
    assetsDir: string;
    tempDir: string;
    repoDir: string;
}

function getRequiredEnv(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
}

function getOptionalEnv(key: string): string | null {
    return process.env[key] || null;
}

const repoDir = path.resolve(__dirname, '..');
const mainDir = path.join(repoDir, 'Main');

export const config: Config = {
    token: getRequiredEnv('TOKEN'),
    guildId: getOptionalEnv('GUILD_ID'),
    databaseDir: path.join(mainDir, 'DATABASE'),
    assetsDir: path.join(mainDir, 'assets'),
    tempDir: path.join(mainDir, 'temp'),
    repoDir: repoDir,
};

export default config;
