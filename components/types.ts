import * as Location from 'expo-location';


export interface LocationType{
    longitude: number;
    latitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
}

export interface MarkerType {
    id: number
    longitude: number;
    latitude: number;
    can_notify: number;
    last_notified_at: string;
    created_at: string
}

export interface TempMarkerType{
    longitude: number;
    latitude: number;
}

export interface ImageType{
    id:number ;
    marker_id: number;
    uri:string;
    created_at:string;
}

export interface LocationConfig {
    accuracy: Location.Accuracy;
    timeInterval: number;  // Как часто обновлять местоположение (мс)
    distanceInterval: number;  // Минимальное расстояние (в метрах) между обновлениями
}

export interface LocationState {
    location: Location.LocationObject | null;
    errorMsg: string | null;
}