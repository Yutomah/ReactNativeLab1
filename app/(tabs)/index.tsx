import React, {useCallback, useContext, useEffect, useState} from 'react';
// import MapView from 'react-native-maps';
import {StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import MapView, {Marker} from "react-native-maps";
import {Context} from "@/components/GlobalContext";
import * as Location from 'expo-location';
import {LocationType, MarkerType, TempMarkerType} from "@/components/types";
import DbProvider from "@/components/DbProvider";
import {router, useFocusEffect} from "expo-router";
import * as SQLite from 'expo-sqlite';
import DatabaseErrorPopup from "@/app/DatabaseErrorPopup";
import * as Notifications from 'expo-notifications';
import CloseMarkerHandler from "@/components/CloseMarkerHandler";

export default function App() {

    const dbProvider:DbProvider = useContext(Context) as DbProvider;
    const [initialRegion, setInitialRegion] = useState<LocationType>();
    const [markers, setMarkers] = useState<MarkerType[]>([]);
    const [userMarker, setUserMarker] = useState<TempMarkerType|null>(null);
    const closeMarkerHandler = new CloseMarkerHandler(dbProvider);

    useFocusEffect(useCallback(() => {
        (async () => {
            const m = await dbProvider.getMarkers();
            if(m === true){
                router.replace({
                    pathname: '/DatabaseErrorPopup',
                })
            }else{
                setMarkers(m);
            }
        })()
    }, []));


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
            setUserMarker(location.coords);
            let subscription;

            subscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 5000,
                    distanceInterval: 0,
                },
                (newLocation) => {
                    setUserMarker(location.coords);
                    closeMarkerHandler.handleNewUserPosition(newLocation.coords);
                }
            );

            return () =>{
                if(subscription){
                    subscription.remove();
                }
            }

        })();
    }, []);

    const handleMapPress = (event: any) => {
        const {coordinate} = event.nativeEvent;
        dbProvider.addMarker(coordinate.longitude, coordinate.latitude);

        (async () => {
            const m = await dbProvider.getMarkers();
            if(m === true){
                router.replace({
                    pathname: '/DatabaseErrorPopup',
                })
            }else{
                setMarkers(m);
            }

        })();

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
                    {markers.map((marker:MarkerType) =>
                        <Marker
                            key={marker.id}
                            onPress={() => handleMarkerPress(marker.id)}
                            coordinate={{
                                latitude: marker.latitude,
                                longitude: marker.longitude,
                            }}
                        />)
                    }
                    {userMarker === null? null : <Marker coordinate={userMarker} pinColor={'blue'}></Marker>}
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