import React from 'react';
import AppLoading from 'expo-app-loading';

import OnboardingScreen from './source/screens/OnboardingScreen';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { Bangers_400Regular } from '@expo-google-fonts/bangers';

export default function App() {
  let [fontsLoaded] = useFonts({
    POPPINS400: Poppins_400Regular,
    POPPINS500: Poppins_500Medium,
    POPPINS600: Poppins_600SemiBold,
    POPPINS700: Poppins_700Bold,
    BANGERS400: Bangers_400Regular,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return <OnboardingScreen />;
}
