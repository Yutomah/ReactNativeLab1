import {Stack, Tabs} from "expo-router";
import {type ImageSource} from 'expo-image';
import {MarkerType} from "@/components/types";
import {GlobalContextProvider} from "@/components/GlobalContext";



export default function RootLayout() {

    return (
        <Stack>
            <Stack.Screen name="[id]" options={{ headerShown: false }} />
        </Stack>
    );
}
