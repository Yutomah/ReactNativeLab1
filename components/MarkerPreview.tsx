import React from 'react';
import MapView from 'react-native-maps';
import {StyleSheet, View, Text, Image} from 'react-native';
import {MarkerType} from "@/components/types";
import {Link} from "expo-router";

type Props = {
    marker: MarkerType;
    markerIndex?: number;
};

export default function MarkerPreview({marker, markerIndex}: Props) {
    return (
        <View style={styles.container} key={markerIndex ? markerIndex : 0}>
            <View>
                <Text>Latitude {marker.latitude}</Text>
                <Text>Latitude {marker.longitude}</Text>
                <Link style={styles.editButton} href={{
                    pathname: '/marker/[id]',
                    params: {id: (markerIndex as unknown as string)},
                }}>
                    <Text style={styles.editText}>Edit</Text>
                </Link>
            </View>

            {marker.images[0] ?
                <Image source={marker.images[0]}
                       style={styles.image}/> :
                null
            }

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#bbaa99',
        margin: 10,
        padding: 10,
        borderRadius: 5,
    },
    image: {
        width: 250,
        height: 250,
        borderRadius: 18,
        margin: 10,
        alignItems: 'center',
    },
    editButton: {
        flex: 1,
        width: '80%',
        height: 40,
        backgroundColor: '#aa99bb',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 10,
        textAlign: "center",
        padding: 10,
    },
    editText: {
        textAlign: "center",
        margin: 10,
    }

});