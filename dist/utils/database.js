"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadJson = loadJson;
exports.saveJson = saveJson;
exports.loadEnemyList = loadEnemyList;
exports.loadServerBase = loadServerBase;
exports.loadPlayerBase = loadPlayerBase;
exports.saveServerBase = saveServerBase;
exports.savePlayerBase = savePlayerBase;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const config_1 = require("../config");
/**
 * Load JSON file with error handling
 */
function loadJson(filePath, defaultValue) {
    try {
        const content = fs_1.default.readFileSync(filePath, 'utf-8');
        return JSON.parse(content);
    }
    catch (error) {
        console.warn(`Failed to load ${filePath}, using default value`);
        return defaultValue;
    }
}
/**
 * Save JSON file
 */
function saveJson(filePath, data) {
    fs_1.default.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}
/**
 * Load enemy list from database
 */
function loadEnemyList() {
    return loadJson(path_1.default.join(config_1.config.databaseDir, 'Enemylist.json'), {});
}
/**
 * Load server base from database
 */
function loadServerBase() {
    return loadJson(path_1.default.join(config_1.config.databaseDir, 'ServerBase.json'), {});
}
/**
 * Load player base from database
 */
function loadPlayerBase() {
    return loadJson(path_1.default.join(config_1.config.databaseDir, 'PlayerBase.json'), {});
}
/**
 * Save server base to database
 */
function saveServerBase(data) {
    saveJson(path_1.default.join(config_1.config.databaseDir, 'ServerBase.json'), data);
}
/**
 * Save player base to database
 */
function savePlayerBase(data) {
    saveJson(path_1.default.join(config_1.config.databaseDir, 'PlayerBase.json'), data);
}
//# sourceMappingURL=database.js.map