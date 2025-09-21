export const DEFAULT_COLOR_PALETTE: string[] = [
  '#4B9CD5',
  '#1B338C',
  '#A7D4EE',
  '#579A42',
  '#AAFCBA',
  '#3A5F71',
  '#EFE6D6',
  '#5BBEBA',
  '#FBF486',
  '#A4A9E2',
  '#D7423B',
  '#CCCBC9',
  '#A96C20',
  '#968F87',
];

export const UNMAPPED_COLOR = '#000000';

export const getPaletteColorOrFallback = (
  index: number,
  colorPalette?: string[],
): string => {
  const colors = colorPalette || DEFAULT_COLOR_PALETTE;

  if (index < 0 || index >= colors.length) {
    return UNMAPPED_COLOR;
  }

  return colors[index];
};

export const buildStatusColorPalette = (
  statuses: string[],
  statusColors: Record<string, string>,
): string[] => {
  let fallbackIndex = 0;

  return statuses.map((status) => {
    const mappedColor = statusColors[status];
    if (mappedColor) return mappedColor;

    const fallbackColor =
      DEFAULT_COLOR_PALETTE[fallbackIndex] ?? UNMAPPED_COLOR;
    fallbackIndex += 1;

    return fallbackColor;
  });
};
