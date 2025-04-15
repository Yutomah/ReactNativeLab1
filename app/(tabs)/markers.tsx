import React, {useCallback, useContext, useEffect, useState} from 'react';
import MapView from 'react-native-maps';
import {StyleSheet, View, Text, Image, Button, FlatList, Pressable} from 'react-native';
import {LocationType, MarkerType} from "@/components/types";
import MarkerPreview from "@/components/MarkerPreview";
import {Context} from "@/components/GlobalContext";
import * as ImagePicker from "expo-image-picker";
import {SafeAreaView} from 'react-native-safe-area-context';
import {router, Link, useFocusEffect} from "expo-router";
import DbProvider from "@/components/DbProvider";
import {Modal} from 'react-native';

export default function MarkersPage() {

    const dbProvider: DbProvider = useContext(Context) as DbProvider;
    const [markers, setMarkers] = useState<MarkerType[]>([]);

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

    const handleAddMarker = () => {
        router.push({
            pathname: '/point_chooser/[id]',
            params: {id: -1},
        });
    }

    return (
        <SafeAreaView style={styles.container}>

            <Pressable onPress={handleAddMarker} style={styles.button}>
                <Text>Add marker</Text>
            </Pressable>

            <FlatList
                data={markers}
                renderItem={({item}) => (
                    <MarkerPreview marker={item}/>
                )}>
            </FlatList>
        </SafeAreaView>


    );
}

const styles = StyleSheet.create({
    button: {
        width: '80%',
        height: 40,
        backgroundColor: '#aaaaaa',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        margin: 10,
    },
    container: {
        flex: 1,
        alignItems: 'center',
    },
    map: {
        width: '100%',
        height: '100%',
    },
});