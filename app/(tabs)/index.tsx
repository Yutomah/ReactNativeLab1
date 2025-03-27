import React, {useContext, useEffect, useState} from 'react';
// import MapView from 'react-native-maps';
import {StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import MapView, {Marker} from "react-native-maps";
import {Context} from "@/components/GlobalContext";
import * as Location from 'expo-location';
import {LocationType} from "@/components/types";
import {router} from "expo-router";

export default function App() {
    const {markers, setMarkers} = useContext(Context);
    const [initialRegion, setInitialRegion] = useState<LocationType>();

    useEffect(() => {
        (async () => {
            const {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            setInitialRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.922,
                longitudeDelta: 0.421,
            });
        })();
    }, []);

    const handleMapPress = (event: any) => {
        const {coordinate} = event.nativeEvent;
        setMarkers((markers: any) => [...markers, {
                longitude: coordinate.longitude,
                latitude: coordinate.latitude,
                images: [],
            }]
        )
    }
    const handleMarkerPress = (index:number)=>{
        router.push({
            pathname: '/marker/[id]',
                params: {id: index},
        })
    }

    return (
        <SafeAreaView style={styles.container}>
            {initialRegion &&
                <MapView
                    style={styles.map}
                    initialRegion={initialRegion}
                    onLongPress={handleMapPress}
                >
                    {markers.map((marker, index) =>
                        <Marker
                            key={index}
                            onPress={() => handleMarkerPress(index)}
                            coordinate={{
                                latitude: marker.latitude,
                                longitude: marker.longitude,
                            }}
                        />)
                    }
                </MapView>
            }
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
});