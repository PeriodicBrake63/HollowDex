/**
 * Type definitions for HollowDex
 */

/**
 * Enemy ability configuration
 */
export interface EnemyAbility {
    type: 'summon';
    summons: string;
    count: number;
}

/**
 * Enemy specification from Enemylist.json
 */
export interface EnemySpec {
    name: string;
    category: string;
    health: number;
    attack: number;
    ability: EnemyAbility | 0;
    rarity: number;
}

/**
 * Enemy list mapping from key to spec
 */
export interface EnemyList {
    [key: string]: EnemySpec;
}

/**
 * Server configuration stored in ServerBase.json
 */
export interface ServerConfig {
    spawn_ch: string | null;
    disabled: boolean;
    spawn_channel_id?: string;
}

/**
 * Server base mapping from guild ID to config
 */
export interface ServerBase {
    [guildId: string]: ServerConfig;
}

/**
 * Captured enemy instance in player collection
 */
export interface CapturedEnemy {
    id: string;              // Unique ID for this specific enemy instance
    enemyKey: string;        // Key from Enemylist.json
    nickname: string | null; // Optional custom nickname
    xp: number;              // Individual enemy XP (unused for now)
    capturedAt: string;      // ISO timestamp
}

/**
 * Player data structure
 */
export interface PlayerData {
    xp: number;
    enemies: CapturedEnemy[];
}

/**
 * Player base mapping from user ID to data
 */
export interface PlayerBase {
    [userId: string]: PlayerData;
}

/**
 * Card compilation specs
 */
export interface CardSpecs {
    name: string;
    category: string;
    health: number;
    attack: number;
    ability: EnemyAbility | 0;
}

/**
 * Active spawn data (in-memory)
 */
export interface ActiveSpawn {
    enemyKey: string;
    spawnedAt: Date;
    caughtBy: string | null;
}

/**
 * Trade session data (in-memory)
 */
export interface TradeSession {
    initiator: string;
    target: string;
    initiatorOffer: string[];  // Enemy IDs
    targetOffer: string[];     // Enemy IDs
    initiatorConfirmed: boolean;
    targetConfirmed: boolean;
    createdAt: Date;
}

/**
 * Command interface
 */
export interface Command {
    data: any; // Using any for builder to avoid complex type dependencies here
    execute: (interaction: any) => Promise<void>;
    autocomplete?: (interaction: any) => Promise<void>;
}
