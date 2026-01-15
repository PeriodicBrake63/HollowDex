"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const config_1 = require("./config");
const client_1 = require("./client");
// Import commands
const enemyCommand = __importStar(require("./commands/enemy"));
const playerCommand = __importStar(require("./commands/player"));
const tradeCommand = __importStar(require("./commands/trade"));
// Import events
const readyEvent = __importStar(require("./events/ready"));
const messageCreateEvent = __importStar(require("./events/messageCreate"));
const interactionCreateEvent = __importStar(require("./events/interactionCreate"));
const commands = [
    enemyCommand.data.toJSON(),
    playerCommand.data.toJSON(),
    tradeCommand.data.toJSON(),
];
/**
 * Register slash commands with Discord
 */
async function registerCommands() {
    const rest = new discord_js_1.REST().setToken(config_1.config.token);
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
        // Register commands globally
        const data = await rest.put(discord_js_1.Routes.applicationCommands(client_1.client.application.id), { body: commands });
        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        // Log registered commands
        console.log('Synced commands:');
        for (const cmd of commands) {
            console.log(`- ${cmd.name}: ${cmd.description}`);
        }
    }
    catch (error) {
        console.error('Error registering commands:', error);
    }
}
/**
 * Register event handlers
 */
function registerEvents() {
    // Ready event (once)
    if (readyEvent.once) {
        client_1.client.once(readyEvent.name, async (...args) => {
            await readyEvent.execute();
            await registerCommands();
        });
    }
    // Message create event
    client_1.client.on(messageCreateEvent.name, messageCreateEvent.execute);
    // Interaction create event
    client_1.client.on(interactionCreateEvent.name, interactionCreateEvent.execute);
}
/**
 * Main entry point
 */
async function main() {
    console.log('Starting HollowDex bot...');
    // Register event handlers
    registerEvents();
    // Login to Discord
    await client_1.client.login(config_1.config.token);
}
// Run the bot
main().catch(console.error);
//# sourceMappingURL=index.js.map