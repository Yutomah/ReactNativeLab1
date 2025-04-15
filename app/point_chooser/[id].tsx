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
import DbProvider from "@/components/DbProvider";


export default function App() {
    const dbProvider:DbProvider = useContext(Context) as DbProvider;
    const [marker, setMarker] = useState<MarkerType|null>(null);

    const {id} = useLocalSearchParams();
    const intId = ((id as unknown) as number);
    useEffect(() => {
        (async () => {
            const m = await dbProvider.getMarker(intId);
            if(m === true){
                router.replace({
                    pathname: '/DatabaseErrorPopup',
                })
            }else{
                setMarker(m);
            }
        })()
    }, []);



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
            if(marker !== null){
                setInitialRegion({
                    latitude: marker?.latitude ?? 0,
                    longitude: marker?.longitude ?? 0,
                    latitudeDelta: 0.922,
                    longitudeDelta: 0.421,
                });
            }
        }, [marker])
    }



    const handleMapPress = (event: any) => {
        (async () =>{
            const {coordinate} = event.nativeEvent;

            if (id == "-1") {
                await dbProvider.addMarker(coordinate.longitude, coordinate.latitude);
            } else {
                await dbProvider.updateMarkerPos(intId, coordinate.longitude, coordinate.latitude);
            }
            router.back();
        })();
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
                                latitude: marker?.latitude ?? 0,
                                longitude: marker?.longitude ?? 0,
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