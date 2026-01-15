/**
 * Resync server configurations
 * Updates ServerBase with any new guilds the bot has joined
 */
export declare function resyncServs(): Promise<void>;
/**
 * Start the backup loop
 * Runs every 120 seconds to sync database changes
 */
export declare function startBackupLoop(): Promise<void>;
declare const _default: {
    resyncServs: typeof resyncServs;
    startBackupLoop: typeof startBackupLoop;
};
export default _default;
//# sourceMappingURL=sync.d.ts.map