import { Events, Interaction } from 'discord.js';
/**
 * Interaction create event handler
 * Routes slash commands and autocomplete to appropriate handlers
 */
export declare const name = Events.InteractionCreate;
export declare const once = false;
export declare function execute(interaction: Interaction): Promise<void>;
declare const _default: {
    name: Events;
    once: boolean;
    execute: typeof execute;
};
export default _default;
//# sourceMappingURL=interactionCreate.d.ts.map