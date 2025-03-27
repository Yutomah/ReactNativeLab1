import {ImageSource} from "expo-image";

export interface LocationType{
    longitude: number;
    latitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
}

export interface MarkerType {
    longitude: number;
    latitude: number;
    images: ImageSource[];
}

export interface ContextType {
    markers: MarkerType[];
    setMarkers: any;

}