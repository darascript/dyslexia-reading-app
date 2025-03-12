import { Platform } from 'react-native';
import * as Font from 'expo-font';

export const loadFonts = async () => {
  // For both native and web, load fonts using Expo's Font API
  return Font.loadAsync({
    'OpenDyslexic': require('../assets/fonts/OpenDyslexic-Regular.otf'),
  });
};