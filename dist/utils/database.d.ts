import { EnemyList, ServerBase, PlayerBase } from '../types';
/**
 * Load JSON file with error handling
 */
export declare function loadJson<T>(filePath: string, defaultValue: T): T;
/**
 * Save JSON file
 */
export declare function saveJson<T>(filePath: string, data: T): void;
/**
 * Load enemy list from database
 */
export declare function loadEnemyList(): EnemyList;
/**
 * Load server base from database
 */
export declare function loadServerBase(): ServerBase;
/**
 * Load player base from database
 */
export declare function loadPlayerBase(): PlayerBase;
/**
 * Save server base to database
 */
export declare function saveServerBase(data: ServerBase): void;
/**
 * Save player base to database
 */
export declare function savePlayerBase(data: PlayerBase): void;
//# sourceMappingURL=database.d.ts.map