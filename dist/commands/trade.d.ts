import { ChatInputCommandInteraction, AutocompleteInteraction } from 'discord.js';
/**
 * Trade command group
 */
export declare const data: import("discord.js").SlashCommandSubcommandsOnlyBuilder;
/**
 * Execute trade commands
 */
export declare function execute(interaction: ChatInputCommandInteraction): Promise<void>;
/**
 * Handle autocomplete for enemy selection
 */
export declare function autocomplete(interaction: AutocompleteInteraction): Promise<void>;
declare const _default: {
    data: import("discord.js").SlashCommandSubcommandsOnlyBuilder;
    execute: typeof execute;
    autocomplete: typeof autocomplete;
};
export default _default;
//# sourceMappingURL=trade.d.ts.map