"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
exports.execute = execute;
const discord_js_1 = require("discord.js");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const database_1 = require("../utils/database");
const cardCompiler_1 = require("../utils/cardCompiler");
const config_1 = require("../config");
const enemyList = (0, database_1.loadEnemyList)();
/**
 * Enemy command group
 */
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('enemy')
    .setDescription('Enemy-related commands')
    .addSubcommand(subcommand => subcommand
    .setName('inspect')
    .setDescription('Inspect an enemy by key or name')
    .addStringOption(option => option
    .setName('query')
    .setDescription('Enemy key or display name')
    .setRequired(true)));
/**
 * Execute enemy commands
 */
async function execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    if (subcommand === 'inspect') {
        await handleInspect(interaction);
    }
}
/**
 * Handle /enemy inspect command
 */
async function handleInspect(interaction) {
    let query = interaction.options.getString('query', true);
    // Clean up query
    query = query.toLowerCase().trim();
    if (query.includes(',')) {
        query = query.split(',')[0].trim();
    }
    if (query.includes('#')) {
        query = query.split('#')[0].trim();
    }
    query = query.replace('enemy ', '').trim();
    // Find enemy by exact match first
    let found = null;
    for (const [key, spec] of Object.entries(enemyList)) {
        if (key.toLowerCase() === query || spec.name.toLowerCase() === query) {
            found = [key, spec];
            break;
        }
    }
    // If no exact match, try partial match
    if (!found) {
        for (const [key, spec] of Object.entries(enemyList)) {
            if (key.toLowerCase().includes(query) || spec.name.toLowerCase().includes(query)) {
                found = [key, spec];
                break;
            }
        }
    }
    if (!found) {
        await interaction.reply(`Enemy '${query}' not found.`);
        return;
    }
    const [key, spec] = found;
    const name = spec.name;
    const hp = spec.health;
    const atk = spec.attack;
    const ability = spec.ability;
    const descParts = [`HP: ${hp}`, `ATK: ${atk}`];
    if (ability !== 0 && typeof ability === 'object') {
        descParts.push(`Ability: ${JSON.stringify(ability)}`);
    }
    // Try to generate card image
    let imgFile = null;
    try {
        const tmpDir = config_1.config.tempDir;
        if (!fs_1.default.existsSync(tmpDir)) {
            fs_1.default.mkdirSync(tmpDir, { recursive: true });
        }
        const outName = `${key.replace(/ /g, '_')}_card.png`;
        const outPath = path_1.default.join(tmpDir, outName);
        await (0, cardCompiler_1.compileCard)(spec, outPath);
        if (fs_1.default.existsSync(outPath)) {
            imgFile = outPath;
        }
    }
    catch (error) {
        console.error('Card compilation error:', error);
    }
    const embed = new discord_js_1.EmbedBuilder()
        .setTitle(name)
        .setDescription(descParts.join(' | '));
    if (imgFile && fs_1.default.existsSync(imgFile)) {
        try {
            const file = new discord_js_1.AttachmentBuilder(imgFile, { name: path_1.default.basename(imgFile) });
            embed.setImage(`attachment://${path_1.default.basename(imgFile)}`);
            await interaction.reply({ embeds: [embed], files: [file] });
            return;
        }
        catch (error) {
            console.error('Failed to attach image:', error);
        }
    }
    await interaction.reply({ embeds: [embed] });
}
exports.default = { data: exports.data, execute };
//# sourceMappingURL=enemy.js.map