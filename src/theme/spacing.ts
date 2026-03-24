export const Spacing = {
  spacing_1: 4,
  spacing_2: 8,
  spacing_3: 12,
  spacing_4: 16,
  spacing_5: 20,
  spacing_6: 24,
  spacing_8: 32,
} as const;

export type SpacingToken = keyof typeof Spacing;
