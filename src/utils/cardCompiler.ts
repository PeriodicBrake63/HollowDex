import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { config } from '../config';
import { CardSpecs, EnemyAbility } from '../types';

/**
 * Compile an enemy card image
 * Uses sharp library for async image processing (replacement for Python PIL)
 */
export async function compileCard(specs: CardSpecs, outputPath: string): Promise<void> {
    const basePath = path.join(config.assetsDir, 'background', `${specs.category}.png`);
    const enemyDir = path.join(config.assetsDir, 'enemies', specs.category);

    // Find enemy image
    let enemyPath: string | null = null;
    const wantName = specs.name.toLowerCase().replace(/ /g, '');

    try {
        const files = fs.readdirSync(enemyDir);
        for (const fname of files) {
            if (!fname.toLowerCase().endsWith('.png')) continue;
            const fnorm = fname.toLowerCase().replace(/ /g, '');
            if (fnorm.startsWith(wantName) || fnorm.includes(wantName)) {
                enemyPath = path.join(enemyDir, fname);
                break;
            }
        }
    } catch {
        // Directory might not exist
    }

    if (!enemyPath) {
        enemyPath = path.join(enemyDir, `${specs.name}.png`);
    }

    // Generate ability text
    let abilityText: string;
    if (specs.ability === 0) {
        abilityText = 'Does not have an ability';
    } else {
        const ability = specs.ability as EnemyAbility;
        abilityText = `Can summon a ${ability.summons}\n${ability.count} times during combat.`;
    }

    const health = String(specs.health);
    const attack = String(specs.attack);

    // Load base image
    const baseImage = sharp(basePath);
    const baseMetadata = await baseImage.metadata();
    const baseWidth = baseMetadata.width || 750;
    const baseHeight = baseMetadata.height || 1050;

    // Load and resize overlay (enemy image)
    let overlayBuffer: Buffer | null = null;
    try {
        if (fs.existsSync(enemyPath)) {
            overlayBuffer = await sharp(enemyPath)
                .resize(640, 360, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
                .toBuffer();
        }
    } catch {
        // Enemy image not found, continue without it
    }

    // Load icons
    const maskIconPath = path.join(config.assetsDir, 'icons', 'mask.png');
    const nailIconPath = path.join(config.assetsDir, 'icons', 'nail.png');

    let maskBuffer: Buffer | null = null;
    let nailBuffer: Buffer | null = null;

    try {
        if (fs.existsSync(maskIconPath)) {
            maskBuffer = await sharp(maskIconPath)
                .resize(100, 100, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
                .toBuffer();
        }
    } catch {
        // Icon not found
    }

    try {
        if (fs.existsSync(nailIconPath)) {
            nailBuffer = await sharp(nailIconPath)
                .resize(100, 100, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
                .toBuffer();
        }
    } catch {
        // Icon not found
    }

    // Build composite layers
    const composites: sharp.OverlayOptions[] = [];

    if (overlayBuffer) {
        composites.push({ input: overlayBuffer, top: 65, left: 55 });
    }

    if (maskBuffer) {
        composites.push({ input: maskBuffer, top: 910, left: 65 });
    }

    if (nailBuffer) {
        composites.push({ input: nailBuffer, top: 910, left: 579 });
    }

    // Create text overlays using SVG
    const svgText = `
        <svg width="${baseWidth}" height="${baseHeight}">
            <style>
                @font-face {
                    font-family: 'GameFont';
                    src: url('${path.join(config.assetsDir, 'fonts', 'font.ttf')}');
                }
                .title { font-family: sans-serif; font-size: 40px; fill: white; }
                .label { font-family: sans-serif; font-size: 40px; fill: white; }
                .desc { font-family: sans-serif; font-size: 30px; fill: white; }
                .stat { font-family: sans-serif; font-size: 40px; fill: white; }
            </style>
            <text x="65" y="45" class="title">${escapeXml(specs.name)}</text>
            <text x="65" y="470" class="label">Ability:</text>
            <text x="75" y="510" class="desc">${escapeXml(abilityText.split('\n')[0])}</text>
            ${abilityText.split('\n')[1] ? `<text x="75" y="545" class="desc">${escapeXml(abilityText.split('\n')[1])}</text>` : ''}
            <text x="165" y="965" class="stat">${escapeXml(health)}</text>
            <text x="560" y="965" class="stat" text-anchor="end">${escapeXml(attack)}</text>
        </svg>
    `;

    composites.push({
        input: Buffer.from(svgText),
        top: 0,
        left: 0,
    });

    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Compose and save final image
    await baseImage
        .composite(composites)
        .png()
        .toFile(outputPath);
}

/**
 * Escape special XML characters
 */
function escapeXml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

export default { compileCard };
