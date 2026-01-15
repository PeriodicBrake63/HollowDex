import { Events, Message } from 'discord.js';
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