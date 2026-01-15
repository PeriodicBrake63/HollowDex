import fs from 'fs';
import path from 'path';
import { config } from '../config';
import { EnemyList, ServerBase, PlayerBase } from '../types';

/**
 * Load JSON file with error handling
 */
export function loadJson<T>(filePath: string, defaultValue: T): T {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(content) as T;
    } catch (error) {
        console.warn(`Failed to load ${filePath}, using default value`);
        return defaultValue;
    }
}

/**
 * Save JSON file
 */
export function saveJson<T>(filePath: string, data: T): void {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

/**
 * Load enemy list from database
 */
export function loadEnemyList(): EnemyList {
    return loadJson<EnemyList>(
        path.join(config.databaseDir, 'Enemylist.json'),
        {}
    );
}

/**
 * Load server base from database
 */
export function loadServerBase(): ServerBase {
    return loadJson<ServerBase>(
        path.join(config.databaseDir, 'ServerBase.json'),
        {}
    );
}

/**
 * Load player base from database
 */
export function loadPlayerBase(): PlayerBase {
    return loadJson<PlayerBase>(
        path.join(config.databaseDir, 'PlayerBase.json'),
        {}
    );
}

/**
 * Save server base to database
 */
export function saveServerBase(data: ServerBase): void {
    saveJson(path.join(config.databaseDir, 'ServerBase.json'), data);
}

/**
 * Save player base to database
 */
export function savePlayerBase(data: PlayerBase): void {
    saveJson(path.join(config.databaseDir, 'PlayerBase.json'), data);
}
