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
exports.once = exports.name = void 0;
exports.execute = execute;
const discord_js_1 = require("discord.js");
const messageCreate_1 = require("./messageCreate");
const playerUtils_1 = require("../utils/playerUtils");
const database_1 = require("../utils/database");
// Import commands
const enemyCommand = __importStar(require("../commands/enemy"));
const playerCommand = __importStar(require("../commands/player"));
const tradeCommand = __importStar(require("../commands/trade"));
const commands = new Map([
    ['enemy', enemyCommand],
    ['player', playerCommand],
    ['trade', tradeCommand],
]);
const enemyList = (0, database_1.loadEnemyList)();
/**
 * Interaction create event handler
 * Routes slash commands and autocomplete to appropriate handlers
 */
exports.name = discord_js_1.Events.InteractionCreate;
exports.once = false;
async function execute(interaction) {
    // Handle button interactions (Catch system)
    if (interaction.isButton()) {
        const customId = interaction.customId;
        if (customId.startsWith('catch_')) {
            await handleCatch(interaction);
        }
        return;
    }
    // Handle slash commands
    if (interaction.isChatInputCommand()) {
        const command = commands.get(interaction.commandName);
        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }
        try {
            await command.execute(interaction);
        }
        catch (error) {
            console.error(`Error executing ${interaction.commandName}:`, error);
            const errorMessage = 'There was an error while executing this command!';
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: errorMessage, ephemeral: true });
            }
            else {
                await interaction.reply({ content: errorMessage, ephemeral: true });
            }
        }
    }
    // Handle autocomplete
    if (interaction.isAutocomplete()) {
        const command = commands.get(interaction.commandName);
        if (!command || !command.autocomplete) {
            return;
        }
        try {
            await command.autocomplete(interaction);
        }
        catch (error) {
            console.error(`Autocomplete error for ${interaction.commandName}:`, error);
        }
    }
}
/**
 * Handle catch button interaction
 */
async function handleCatch(interaction) {
    const messageId = interaction.message.id;
    const spawnData = messageCreate_1.activeSpawns.get(messageId);
    if (!spawnData) {
        await interaction.reply({
            content: 'This enemy has fled or is no longer available.',
            ephemeral: true
        });
        return;
    }
    if (spawnData.caughtBy) {
        await interaction.reply({
            content: 'This enemy has already been caught!',
            ephemeral: true
        });
        return;
    }
    // Check if player is initialized
    try {
        (0, playerUtils_1.addEnemyToCollection)(interaction.user.id, 'check_only');
    }
    catch (e) {
        if (e.message === 'Player not initialized') {
            await interaction.reply({
                content: 'You cannot catch enemies yet! Use `/player init` to start your adventure.',
                ephemeral: true
            });
            return;
        }
        // Other errors ignored as we're just checking init status
    }
    // Try to catch
    const userId = interaction.user.id;
    const enemyKey = spawnData.enemyKey;
    const isCaught = (0, playerUtils_1.attemptCatch)(enemyKey);
    if (isCaught) {
        try {
            spawnData.caughtBy = userId;
            const enemy = (0, playerUtils_1.addEnemyToCollection)(userId, enemyKey);
            const enemySpec = enemyList[enemyKey];
            const enemyName = enemySpec ? enemySpec.name : enemyKey;
            await interaction.reply({
                content: `🎉 Gotcha! **${interaction.user.username}** caught a wild **${enemyName}**! (+XP)`,
            });
            // In a real scenario you might update the message to remove the button
        }
        catch (error) {
            console.error('Catch error:', error);
            await interaction.reply({
                content: 'Something went wrong while catching.',
                ephemeral: true
            });
            spawnData.caughtBy = null; // Reset on error
        }
    }
    else {
        await interaction.reply({
            content: `The ${enemyKey} dodged your attempt! try again!`,
            ephemeral: true
        });
    }
}
exports.default = { name: exports.name, once: exports.once, execute };
//# sourceMappingURL=interactionCreate.js.map