import React, {useContext} from 'react';
import MapView from 'react-native-maps';
import {StyleSheet, View, Image, FlatList, Text, Button, Pressable} from 'react-native';
import {ImageSource} from "expo-image";
import {MarkerType} from "@/components/types";
import * as ImagePicker from "expo-image-picker";
import MarkerPreview from "@/components/MarkerPreview";
import {Context} from "@/components/GlobalContext";
import {router, useLocalSearchParams} from 'expo-router';
import {SafeAreaView} from 'react-native-safe-area-context';
import DeleteableImage from "@/components/DeleteableImage";


export default function MarkerPage() {
    const {markers, setMarkers} = useContext(Context);
    const {id} = useLocalSearchParams();
    const intId = ((id as unknown) as number);
    const marker = markers[intId];

    const editCoordinates = () => {
        router.push({
            pathname: '/point_chooser/[id]',
            params: {id: intId},
        })
    }
    const deleteMarker = () => {
        setMarkers((markers: any) => markers.filter((marker: any, index: any) => index != intId));
        router.back();
    }
    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setMarkers((markers: any) => markers.map((marker: any, index: any) =>
                index == intId
                    ? {...marker, images: [...marker.images, {uri: result.assets[0].uri}]}
                    : marker
            ));
        } else {
            alert('You did not select any image.');
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            <Text>
                Longitude: {marker.longitude}
            </Text><Text>
            Latitude: {marker.latitude}
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
                data={marker.images}
                renderItem={({item, index}) => (
                    <DeleteableImage markerIndex={intId} imageIndex={index}></DeleteableImage>
                    //<Image source={item?item:require("../../assets/images/godot_img.png")} key={index} style={styles.image}/>
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