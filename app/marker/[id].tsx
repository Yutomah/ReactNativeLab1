import React, {useCallback, useContext, useEffect, useState} from 'react';
import MapView from 'react-native-maps';
import {StyleSheet, View, Image, FlatList, Text, Button, Pressable} from 'react-native';
import {ImageSource} from "expo-image";
import {MarkerType, ImageType} from "@/components/types";
import * as ImagePicker from "expo-image-picker";
import MarkerPreview from "@/components/MarkerPreview";
import {Context} from "@/components/GlobalContext";
import {router, useFocusEffect, useLocalSearchParams} from 'expo-router';
import {SafeAreaView} from 'react-native-safe-area-context';
import DeleteableImage from "@/components/DeleteableImage";
import DbProvider from "@/components/DbProvider";


export default function MarkerPage() {
    const dbProvider: DbProvider = useContext(Context) as DbProvider;
    const [marker, setMarker] = useState<MarkerType|null>(null);
    const [images, setImages] = useState<ImageType[]>([]);

    const {id} = useLocalSearchParams();
    const intId = ((id as unknown) as number);
    useFocusEffect(
        useCallback(() => {
            (async () => {
                const m = await dbProvider.getMarker(intId);
                setMarker(m);
            })()
        }, [])
    );

    useFocusEffect( useCallback(() => {
        (async () => {
            const i = await dbProvider.getImages(intId);
            setImages(i);
        })()
    }, []));

    const editCoordinates = () => {
        router.push({
            pathname: '/point_chooser/[id]',
            params: {id: intId},
        });
    }
    const deleteMarker = () => {
        // setMarkers((markers: any) => markers.filter((marker: any, index: any) => index != intId));
        dbProvider.removeMarker(marker?.id ?? -1);
        router.back();
    }
    const pickImageAsync = async () => {
        if(marker === null){
            return;
        }
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            await dbProvider.addImage(marker.id, result.assets[0].uri);
            const i = await dbProvider.getImages(intId);
            setImages(i);
        } else {
            alert('You did not select any image.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text>
                id: {marker?.id ?? 'loading'}
            </Text>
            <Text>
                Latitude: {marker?.latitude ?? 'loading'}
            </Text>
            <Text>
                Longitude: {marker?.longitude ?? 'loading'}
            </Text>
            <Pressable onPress={editCoordinates} style={styles.button}>
                <Text>edit coordinates</Text>
            </Pressable>
            <Pressable onPress={deleteMarker} style={styles.button}>
                <Text>delete marker</Text>
            </Pressable>
            <Pressable onPress={pickImageAsync} style={styles.button}>
                <Text>add image</Text>
            </Pressable>
            <Text>Long press on image to delete it</Text>
            <FlatList
                data={images}
                renderItem={({item}) => (
                    <DeleteableImage image={item} marker={marker} setImages={setImages}></DeleteableImage>
                )}>
            </FlatList>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    image: {
        width: 250,
        height: 250,
        borderRadius: 18,
        margin: 10,
        alignItems: 'center',
    },
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
})