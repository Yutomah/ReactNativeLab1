import {SQLiteDatabase} from "expo-sqlite";
import {MarkerType, ImageType} from "@/components/types";



export default class DbProvider {
    private db: SQLiteDatabase;

    constructor(db: SQLiteDatabase) {
        this.db = db;
    }

    async getMarkers() {
        try {
            const allRows = await this.db.getAllAsync<MarkerType>('SELECT * FROM markers');
            return allRows;
        } catch {
            return true;
        }

    }

    async getMarker(id: number) {
        try {
            const row = await this.db.getFirstAsync<MarkerType>('SELECT * FROM markers where id = $id', {$id: id});

            return row;
        } catch {
            return true;
        }
    }

    async addMarker(longitude: number, latitude: number) {
        try {
            await this.db.runAsync('insert into markers (latitude, longitude) values ($latitude, $longitude)',
                {$latitude: latitude, $longitude: longitude});
        } catch {
            return true;
        }
    }

    async removeMarker(id: number) {
        try {
            await this.db.runAsync('DELETE FROM markers WHERE id = $id', {$id: id});
        } catch {
            return true;
        }
    }

    async updateMarkerPos(id: number, longitude: number, latitude: number) {
        try {
            await this.db.runAsync('UPDATE markers SET longitude = $longitude, latitude = $latitude WHERE id = $id',
                {$id: id, $longitude: longitude, $latitude: latitude});
        } catch {
            return true;
        }
    }

    async updateLastNotifiedAt(id: number) {
        try {
            // console.log(id, 'before', await this.getMarker(id));
            await this.db.runAsync('UPDATE markers SET last_notified_at = CURRENT_TIMESTAMP WHERE id = $id', {$id: id});
            // console.log(id, 'after', await this.getMarker(id));
        } catch {
            return true;
        }
    }

    async updateCanNotify(id: number, can_notify:number) {
        try {
            console.log(id, 'before', await this.getMarker(id));
            await this.db.runAsync('UPDATE markers SET can_notify = $can_notify WHERE id = $id', {$id: id, $can_notify: can_notify});
            console.log(id, 'after', await this.getMarker(id));
        } catch {
            return true;
        }
    }

    async getImages(markerId: number) {
        try {
            const allRows = await this.db.getAllAsync<ImageType>(
                'SELECT * FROM marker_images where marker_id = $markerId', {$markerId: markerId});
            return allRows;
        } catch {
            return true;
        }
    }

    async addImage(markerId: number, uri: string) {
        try {
            await this.db.runAsync('insert into marker_images (marker_id, uri) values ($markerId, $uri)',
                {$markerId: markerId, $uri: uri});
        } catch {
            return true;
        }
    }

    async removeImage(imageId: number) {
        try {
            await this.db.runAsync('DELETE FROM marker_images WHERE id = $imageId', {$imageId: imageId});
        } catch {
            return true;
        }
    }


}