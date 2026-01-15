"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = exports.HollowDexClient = void 0;
const discord_js_1 = require("discord.js");
const database_1 = require("./utils/database");
/**
 * Extended Discord client with database properties
 */
class HollowDexClient extends discord_js_1.Client {
    serverBase;
    playerBase;
    commands;
    constructor() {
        super({
            intents: [
                discord_js_1.GatewayIntentBits.Guilds,
                discord_js_1.GatewayIntentBits.GuildMessages,
                discord_js_1.GatewayIntentBits.MessageContent,
            ],
        });
        this.serverBase = (0, database_1.loadServerBase)();
        this.playerBase = (0, database_1.loadPlayerBase)();
        this.commands = new discord_js_1.Collection();
    }
    /**
     * Reload database from files
     */
    reloadDatabase() {
        this.serverBase = (0, database_1.loadServerBase)();
        this.playerBase = (0, database_1.loadPlayerBase)();
    }
}
exports.HollowDexClient = HollowDexClient;
// Singleton client instance
exports.client = new HollowDexClient();
exports.default = exports.client;
//# sourceMappingURL=client.js.map