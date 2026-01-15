import { Events, Message } from 'discord.js';
export declare const activeSpawns: Map<string, {
    enemyKey: string;
    spawnedAt: Date;
    caughtBy: string | null;
}>;
/**
 * Message create event handler
 * Handles random enemy spawns in configured channels
 */
export declare const name = Events.MessageCreate;
export declare const once = false;
export declare function execute(message: Message): Promise<void>;
declare const _default: {
    name: Events;
    once: boolean;
    execute: typeof execute;
};
export default _default;
//# sourceMappingURL=messageCreate.d.ts.map