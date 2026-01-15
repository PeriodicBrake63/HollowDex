import { randomUUID } from 'crypto';
import { client } from '../client';
import { loadEnemyList, savePlayerBase } from './database';
import { CapturedEnemy } from '../types';

const enemyList = loadEnemyList();

/**
 * Calculate player level from XP
 */
export function calculateLevel(xp: number): number {
    return Math.floor(Math.sqrt(xp / 100));
}

/**
 * Initialize a new player with 3 starter Crawlids
 */
export function initializePlayer(userId: string): void {
    if (client.playerBase[userId]) {
        throw new Error('Player already initialized');
    }

    const starterEnemies: CapturedEnemy[] = [];
    const now = new Date().toISOString();

    // Give 3 Crawlids as starters
    for (let i = 0; i < 3; i++) {
        starterEnemies.push({
            id: randomUUID(),
            enemyKey: 'crawlid',
            nickname: null,
            xp: 0,
            capturedAt: now,
        });
    }

    client.playerBase[userId] = {
        xp: 0,
        enemies: starterEnemies,
    };

    savePlayerBase(client.playerBase);
}

/**
 * Add a caught enemy to player's collection
 */
export function addEnemyToCollection(userId: string, enemyKey: string): CapturedEnemy {
    if (!client.playerBase[userId]) {
        throw new Error('Player not initialized');
    }

    const enemy: CapturedEnemy = {
        id: randomUUID(),
        enemyKey,
        nickname: null,
        xp: 0,
        capturedAt: new Date().toISOString(),
    };

    client.playerBase[userId].enemies.push(enemy);

    // Give XP based on rarity
    const enemySpec = enemyList[enemyKey];
    if (enemySpec) {
        const xpGain = Math.floor(10 * enemySpec.rarity * 10); // 10 * rarity * 10
        client.playerBase[userId].xp += xpGain;
    }

    savePlayerBase(client.playerBase);
    return enemy;
}

/**
 * Calculate catch rate for an enemy
 */
export function calculateCatchRate(enemyKey: string): number {
    const enemySpec = enemyList[enemyKey];
    if (!enemySpec) return 0.5;

    const baseRate = 1 / enemySpec.rarity;
    return Math.min(0.95, baseRate * 0.5);
}

/**
 * Attempt to catch an enemy
 */
export function attemptCatch(enemyKey: string): boolean {
    const catchRate = calculateCatchRate(enemyKey);
    return Math.random() < catchRate;
}

/**
 * Get player stats
 */
export function getPlayerStats(userId: string) {
    const playerData = client.playerBase[userId];
    if (!playerData) {
        return null;
    }

    const level = calculateLevel(playerData.xp);
    const totalEnemies = playerData.enemies.length;

    // Count unique enemy types
    const uniqueTypes = new Set(playerData.enemies.map(e => e.enemyKey));
    const uniqueEnemies = uniqueTypes.size;

    return {
        level,
        xp: playerData.xp,
        totalEnemies,
        uniqueEnemies,
    };
}

/**
 * Get enemy by ID from player collection
 */
export function getEnemyById(userId: string, enemyId: string): CapturedEnemy | null {
    const playerData = client.playerBase[userId];
    if (!playerData) return null;

    return playerData.enemies.find(e => e.id === enemyId) || null;
}

/**
 * Remove enemy from player collection (for trades)
 */
export function removeEnemyFromCollection(userId: string, enemyId: string): boolean {
    const playerData = client.playerBase[userId];
    if (!playerData) return false;

    const index = playerData.enemies.findIndex(e => e.id === enemyId);
    if (index === -1) return false;

    playerData.enemies.splice(index, 1);
    savePlayerBase(client.playerBase);
    return true;
}
