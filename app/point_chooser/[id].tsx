import React, {useContext, useEffect, useState} from 'react';
// import MapView from 'react-native-maps';
import {StyleSheet, View, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import MapView, {Marker} from "react-native-maps";
import {Context} from "@/components/GlobalContext";
import * as Location from 'expo-location';
import {LocationType, MarkerType} from "@/components/types";
import {router, useLocalSearchParams} from "expo-router";
import {init} from "cjs-module-lexer";


export default function App() {
    const {markers, setMarkers} = useContext(Context);
    const {id} = useLocalSearchParams();
    const intId = ((id as unknown) as number);
    const marker = markers[intId];

    const [initialRegion, setInitialRegion] = useState<LocationType>();

    if (id == "-1") {
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
    }else{
        useEffect(()=>{
            setInitialRegion({
                latitude: marker.latitude,
                longitude: marker.longitude,
                latitudeDelta: 0.922,
                longitudeDelta: 0.421,
            });
        }, [])
    }


    const handleMapPress = (event: any) => {
        const {coordinate} = event.nativeEvent;

        if (id == "-1") {
            setMarkers((markers: any) => [...markers, {
                    longitude: coordinate.longitude,
                    latitude: coordinate.latitude,
                    images: [],
                }]
            )
        } else {
            setMarkers((markers: any) => markers.map((marker: any, index: any) =>
                index == intId
                    ? {...marker, latitude: coordinate.latitude, longitude: coordinate.longitude}
                    : marker
            ));
        }


        router.back();
    }


    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.text}>Long press on place where you want marker</Text>
            {initialRegion &&
                <MapView
                    style={styles.map}
                    initialRegion={initialRegion}
                    onLongPress={handleMapPress}
                >
                    {id != "-1" ?
                        <Marker
                            coordinate={{
                                latitude: marker.latitude,
                                longitude: marker.longitude,
                            }}
                        /> :
                        null
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
    text:{
        padding:10,
        backgroundColor:'#aaaaaa',
        opacity: 0.7,
    }
});