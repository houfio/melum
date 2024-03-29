import type { Image } from '@spotify/web-api-ts-sdk';

export function getImage(images: Image[], which: 'smallest' | 'largest') {
  const sorted = images.toSorted((a, b) => which === 'smallest' ? a.width - b.width : b.width - a.width);

  return sorted[0] as Image | undefined;
}
