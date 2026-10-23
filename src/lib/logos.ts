// Official logo files in src/assets/logos/, looked up by file name (sources: docs/inputs/logo-sources.md).
import type { ImageMetadata } from 'astro';

const files = import.meta.glob<ImageMetadata>('/src/assets/logos/*.{svg,png}', { eager: true, import: 'default' });

export const logo = (name?: string): ImageMetadata | undefined => (name ? files[`/src/assets/logos/${name}`] : undefined);
