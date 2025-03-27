import {Stack, Tabs} from "expo-router";
import {type ImageSource} from 'expo-image';
import {MarkerType} from "@/components/types";
import {GlobalContextProvider} from "@/components/GlobalContext";



export default function RootLayout() {

    return (
            <Tabs>
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Map',
                        headerShown: false,
                    }}
                />
                <Tabs.Screen
                    name="markers"
                    options={{
                        title: 'Markers',
                        headerShown: false,
                    }}
                />
            </Tabs>
    );
}
