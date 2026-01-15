import { CardSpecs } from '../types';
/**
 * Compile an enemy card image
 * Uses sharp library for async image processing (replacement for Python PIL)
 */
export declare function compileCard(specs: CardSpecs, outputPath: string): Promise<void>;
declare const _default: {
    compileCard: typeof compileCard;
};
export default _default;
//# sourceMappingURL=cardCompiler.d.ts.map