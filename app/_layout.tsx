import { GlobalContextProvider } from '@/components/GlobalContext';
import { Stack } from 'expo-router';

import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <GlobalContextProvider>
                <Stack>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen name="marker" options={{ headerShown: false }} />
                    <Stack.Screen name="point_chooser" options={{headerShown: false}}/>
                </Stack>
                <StatusBar style="light" />
            </GlobalContextProvider>
        </SafeAreaProvider>
    );
}
