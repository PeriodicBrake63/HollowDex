import { Events } from 'discord.js';
/**
 * Ready event handler
 * Called when the bot successfully connects to Discord
 */
export declare const name = Events.ClientReady;
export declare const once = true;
export declare function execute(): Promise<void>;
declare const _default: {
    name: Events;
    once: boolean;
    execute: typeof execute;
};
export default _default;
//# sourceMappingURL=ready.d.ts.map