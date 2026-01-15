import { Client, Collection } from 'discord.js';
import { ServerBase, PlayerBase } from './types';
/**
 * Extended Discord client with database properties
 */
export declare class HollowDexClient extends Client {
    serverBase: ServerBase;
    playerBase: PlayerBase;
    commands: Collection<string, unknown>;
    constructor();
    /**
     * Reload database from files
     */
    reloadDatabase(): void;
}
export declare const client: HollowDexClient;
export default client;
//# sourceMappingURL=client.d.ts.map