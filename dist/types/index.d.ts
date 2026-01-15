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
    id: string;
    enemyKey: string;
    nickname: string | null;
    xp: number;
    capturedAt: string;
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
    initiatorOffer: string[];
    targetOffer: string[];
    initiatorConfirmed: boolean;
    targetConfirmed: boolean;
    createdAt: Date;
}
/**
 * Command interface
 */
export interface Command {
    data: any;
    execute: (interaction: any) => Promise<void>;
    autocomplete?: (interaction: any) => Promise<void>;
}
//# sourceMappingURL=index.d.ts.map