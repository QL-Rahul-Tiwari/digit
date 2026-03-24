export const Colors = {
  surface: '#FAF9F9',
  surface_container_low: '#F4F3F3',
  surface_container_high: '#E9E8E8',
  surface_container_highest: '#DEDCDC',
  surface_bright: '#FFFFFF',

  on_surface: '#1B1C1C',
  on_surface_variant: '#707884',
  on_primary: '#FFFFFF',

  primary: '#0061A3',
  primary_container: '#0095F6',

  outline_variant: '#C8C6C6',

  story_gradient_start: '#C13584',
  story_gradient_end: '#F58529',

  // Glassmorphism surface
  surface_glass: 'rgba(250, 249, 249, 0.80)',

  // Ghost borders (outline_variant at various opacities)
  ghost_border_10: 'rgba(200, 198, 198, 0.10)',
  ghost_border_15: 'rgba(200, 198, 198, 0.15)',
  ghost_border_20: 'rgba(200, 198, 198, 0.20)',

  // Transparent
  transparent: 'transparent',
} as const;

export type ColorToken = keyof typeof Colors;
