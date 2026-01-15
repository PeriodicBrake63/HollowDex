import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { loadServerBase, loadPlayerBase } from './utils/database';
import { ServerBase, PlayerBase } from './types';

/**
 * Extended Discord client with database properties
 */
export class HollowDexClient extends Client {
    public serverBase: ServerBase;
    public playerBase: PlayerBase;
    public commands: Collection<string, unknown>;

    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ],
        });

        this.serverBase = loadServerBase();
        this.playerBase = loadPlayerBase();
        this.commands = new Collection();
    }

    /**
     * Reload database from files
     */
    reloadDatabase(): void {
        this.serverBase = loadServerBase();
        this.playerBase = loadPlayerBase();
    }
}

// Singleton client instance
export const client = new HollowDexClient();

export default client;
