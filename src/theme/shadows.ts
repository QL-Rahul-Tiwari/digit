import { ViewStyle } from 'react-native';
import { Colors } from './colors';

export const Shadows: { ambient: ViewStyle } = {
  ambient: {
    shadowColor: Colors.on_surface,
    shadowOpacity: 0.06,
    shadowRadius: 32,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
};
