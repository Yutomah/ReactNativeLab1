import {GlobalContextProvider} from '@/components/GlobalContext';
import {Stack} from 'expo-router';

import {StatusBar} from 'expo-status-bar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {SQLiteProvider} from "expo-sqlite";
import {StrictMode} from 'react';

export default function RootLayout() {
    return (
        <StrictMode>
            <SafeAreaProvider>
                <SQLiteProvider databaseName={'myMap.db'} assetSource={{assetId: require('../assets/myMap.db')}}>
                    <GlobalContextProvider>
                        <Stack>
                            <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                            <Stack.Screen name="marker" options={{headerShown: false}}/>
                            <Stack.Screen name="point_chooser" options={{headerShown: false}}/>
                        </Stack>
                        <StatusBar style="light"/>
                    </GlobalContextProvider>
                </SQLiteProvider>

            </SafeAreaProvider>
        </StrictMode>
    );
}
