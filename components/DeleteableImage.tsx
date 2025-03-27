import React, {useContext} from 'react';
import MapView from 'react-native-maps';
import {StyleSheet, View, Text, Image, Pressable} from 'react-native';
import {MarkerType} from "@/components/types";
import {Link, useLocalSearchParams} from "expo-router";
import {Context} from "@/components/GlobalContext";

type Props = {
    markerIndex: number;
    imageIndex: number;
};

export default function DeleteableImage({markerIndex, imageIndex}: Props) {
    const {markers, setMarkers} = useContext(Context);
    const marker = markers[markerIndex];

    const handleLongPress = (id: number) => {
        const newImages = marker.images.filter((image, index)=> index != markerIndex);
        setMarkers((markers: any) => markers.map((marker: any, index: any) =>
            index == markerIndex
                ? {...marker, images: newImages}
                : marker
        ));

    }
    return (
        <Pressable onLongPress={() => handleLongPress(imageIndex)}>
            <Image
                source={marker.images[imageIndex] ? marker.images[imageIndex] : require("../assets/images/godot_img.png")}
                style={styles.image}/>
        </Pressable>
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


});