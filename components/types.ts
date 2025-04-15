

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
    created_at: string
}

export interface ImageType{
    id:number ;
    marker_id: number;
    uri:string;
    created_at:string;
}