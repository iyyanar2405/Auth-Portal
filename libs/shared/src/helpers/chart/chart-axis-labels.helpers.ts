export const trimLabel = (label: string, maxLabelLength = 20): string => {
  const suffix = label.length > maxLabelLength ? '...' : '';

  return `${label.slice(0, maxLabelLength)}${suffix}`;
};
