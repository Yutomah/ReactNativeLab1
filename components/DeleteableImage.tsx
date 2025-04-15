import React, {useContext} from 'react';
import MapView from 'react-native-maps';
import {StyleSheet, View, Text, Image, Pressable} from 'react-native';
import {ImageType, MarkerType} from "@/components/types";
import {Link, router, useLocalSearchParams} from "expo-router";
import {Context} from "@/components/GlobalContext";
import DbProvider from "@/components/DbProvider";

type Props = {
    image: ImageType;
    marker: MarkerType|null;
    setImages:(a:ImageType[])=>any;
};

export default function DeleteableImage({image, marker, setImages}: Props) {
    const dbProvider: DbProvider = useContext(Context) as DbProvider;

    const handleLongPress = async () => {
        if(marker === null){
            return;
        }
        await dbProvider.removeImage(image.id);

        const i = await dbProvider.getImages(marker.id);

        if(i === true){
            router.replace({
                pathname: '/DatabaseErrorPopup',
            })
        }else{
            setImages(i);
        }


    }
    return (
        <Pressable onLongPress={handleLongPress}>
            <Image
                source={image.uri ? {uri:image.uri} : require("../assets/images/godot_img.png")}
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