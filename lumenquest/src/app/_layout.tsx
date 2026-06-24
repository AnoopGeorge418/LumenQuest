import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Stack } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

	const [loaded, error] = useFonts({

		// PlayfairDisplay Fonts
		'PlayfairDisplay-Regular': require('../../assets/fonts/PlayfairDisplay-Regular.ttf'),
		'PlayfairDisplay-Bold': require('../../assets/fonts/PlayfairDisplay-Bold.ttf'),
		'PlayfairDisplay-Black': require('../../assets/fonts/PlayfairDisplay-Black.ttf'),

		// Playfair Fonts
		'Playfair-Regular': require('../../assets/fonts/Playfair-Regular.ttf'),
		'Playfair-Bold': require('../../assets/fonts/Playfair-Bold.ttf'),
		'Playfair-Black': require('../../assets/fonts/Playfair-Black.ttf'),

		// PlayfairDisplay Fonts
		'JetBrainsMono-Light': require('../../assets/fonts/JetBrainsMono-Light.ttf'),
		'JetBrainsMono-Regular': require('../../assets/fonts/JetBrainsMono-Regular.ttf'),
		'JetBrainsMono-Bold': require('../../assets/fonts/JetBrainsMono-Bold.ttf'),
    
	});

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }
	
	return (
	<Stack screenOptions={{ headerShown: false }}>
			
		</Stack>
  );
}
