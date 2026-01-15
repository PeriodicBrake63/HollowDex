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
const config_1 = require("./config");
const client_1 = require("./client");
const commandLoader_1 = require("./utils/commandLoader");
// Import events
const readyEvent = __importStar(require("./events/ready"));
const messageCreateEvent = __importStar(require("./events/messageCreate"));
const interactionCreateEvent = __importStar(require("./events/interactionCreate"));
/**
 * Register event handlers
 */
function registerEvents() {
    // Ready event (once)
    if (readyEvent.once) {
        client_1.client.once(readyEvent.name, async (...args) => {
            await readyEvent.execute();
            // Commands are now registered in main() before login or during init, 
            // but we can also trigger a check here if we want to ensure client is ready.
            // However, with the new loader, we can do it independently.
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
    // Load commands
    const commands = await (0, commandLoader_1.loadCommands)();
    console.log(`Loaded ${commands.length} commands.`);
    // Attach commands to client for interaction handler
    client_1.client.commands = new Map();
    for (const cmd of commands) {
        client_1.client.commands.set(cmd.data.name, cmd);
    }
    // Register event handlers
    registerEvents();
    // Login to Discord
    await client_1.client.login(config_1.config.token);
    // Register commands if changed (after login to ensure we have application ID)
    // We need to wait for client to be ready to get application ID, 
    // OR we can rely on the ready event.
    // Let's do it in the ready handler ideally, or wait here.
    // Waiting here is tricky because login is async but doesn't resolve with ready.
    // Let's move registration to the ready event or a separate init function.
    // Actually, client.application is available after ready.
    // Let's use the ready event for registration safety.
    client_1.client.once('ready', async () => {
        await (0, commandLoader_1.registerCommandsIfChanged)(commands);
    });
}
// Run the bot
main().catch(console.error);
//# sourceMappingURL=index.js.map