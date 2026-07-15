export type HomeFeatureCardWidth = `${number}%`;

export function getHomeFeatureCardWidth(
  viewportWidth: number,
  cardIndex: number,
): HomeFeatureCardWidth {
  if (viewportWidth >= 1080) {
    return '32%';
  }

  if (viewportWidth >= 680) {
    return cardIndex === 2 ? '100%' : '48%';
  }

  return '100%';
}
