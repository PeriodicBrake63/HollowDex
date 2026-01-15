"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
function getRequiredEnv(key) {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
}
function getOptionalEnv(key) {
    return process.env[key] || null;
}
const repoDir = path_1.default.resolve(__dirname, '..');
const mainDir = path_1.default.join(repoDir, 'Main');
exports.config = {
    token: getRequiredEnv('TOKEN'),
    guildId: getOptionalEnv('GUILD_ID'),
    databaseDir: path_1.default.join(mainDir, 'DATABASE'),
    assetsDir: path_1.default.join(mainDir, 'assets'),
    tempDir: path_1.default.join(mainDir, 'temp'),
    repoDir: repoDir,
};
exports.default = exports.config;
//# sourceMappingURL=config.js.map