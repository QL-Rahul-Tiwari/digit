import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../theme';

type IconFamily = 'Ionicons' | 'Feather' | 'MaterialIcons';

interface TabBarIconProps {
  family: IconFamily;
  name: string;
  focused: boolean;
  size?: number;
}

export default function TabBarIcon({
  family,
  name,
  focused,
  size = 24,
}: TabBarIconProps) {
  const color = focused ? Colors.primary : Colors.on_surface_variant;

  switch (family) {
    case 'Feather':
      return <Feather name={name} size={size} color={color} />;
    case 'MaterialIcons':
      return <MaterialIcons name={name} size={size} color={color} />;
    case 'Ionicons':
    default:
      return <Ionicons name={name} size={size} color={color} />;
  }
}
