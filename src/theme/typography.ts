import { TextStyle, Platform } from 'react-native';

const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

export const Typography = {
  Display_LG: {
    fontSize: 56,
    fontWeight: '700' as TextStyle['fontWeight'],
    fontFamily,
  },
  Headline_SM: {
    fontSize: 24,
    fontWeight: '700' as TextStyle['fontWeight'],
    fontFamily,
  },
  Title_SM: {
    fontSize: 16,
    fontWeight: '500' as TextStyle['fontWeight'],
    fontFamily,
  },
  Body_MD: {
    fontSize: 14,
    fontWeight: '400' as TextStyle['fontWeight'],
    fontFamily,
  },
  Label_SM: {
    fontSize: 11,
    fontWeight: '500' as TextStyle['fontWeight'],
    letterSpacing: 0.05,
    textTransform: 'uppercase' as TextStyle['textTransform'],
    fontFamily,
  },
} as const;

export type TypographyToken = keyof typeof Typography;
