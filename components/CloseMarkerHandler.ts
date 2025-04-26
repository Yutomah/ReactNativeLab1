import {MarkerType, TempMarkerType} from "@/components/types";
import DbProvider from "@/components/DbProvider";
import * as Notifications from 'expo-notifications';

export default class CloseMarkerHandler {
    closeRange: number = 1000;
    canNotifyAgainRange:number = this.closeRange * 1.1 + 50;
    timeout: number = 5


    dbProvider: DbProvider;
    currentNotifications:{notificationId:string, markerId:number}[] = [];

    constructor(dbProvider: DbProvider) {
        this.dbProvider = dbProvider;

        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: false,
                shouldSetBadge: false,
            }),
        });
    }

    async handleNewUserPosition(userMarker: TempMarkerType) {
        const markers:true|MarkerType[] = await this.dbProvider.getMarkers();
        if(markers === true){
            return;
        }

        for (const marker of markers) {
            if (this.canNotifyAgainRange < this.getDistanceToMarker(userMarker, marker)) {
                marker.can_notify = 1;
            }
        }


        const [closeMarkers, canNotifyAgainMarkers] = this.splitMarkersByCloseness(userMarker, markers);

        for (const closeMarker of closeMarkers) {
            // console.log(closeMarker);
            if (this.canNotify(closeMarker)) {
                this.sendNotify(closeMarker);
            }
        }

        for (const marker of canNotifyAgainMarkers) {
            marker.can_notify = 1;
            this.updateLastNotified(marker);
            this.removeNotification(marker.id);

        }

    }

    splitMarkersByCloseness(userMarker: TempMarkerType, markers: MarkerType[]) {
        const closeMarkers = [];
        const canNotifyAgainMarkers = [];
        for (const marker of markers) {
            if (this.closeRange > this.getDistanceToMarker(userMarker, marker)) {
                closeMarkers.push(marker);
            }

            if (this.canNotifyAgainRange < this.getDistanceToMarker(userMarker, marker) && marker.can_notify === 0) {
                canNotifyAgainMarkers.push(marker);
            }
        }
        return [closeMarkers, canNotifyAgainMarkers];
    }

    canNotify(marker: MarkerType) {
        const now = new Date();
        const lastNotified = new Date(marker.last_notified_at);
        const UTClastNotified = new Date(
            Date.UTC(
                lastNotified.getFullYear(),
                lastNotified.getMonth(),
                lastNotified.getDate(),
                lastNotified.getHours(),
                lastNotified.getMinutes(),
                lastNotified.getSeconds(),
            )
        )

        // console.log(now.getTime(), lastNotified.getTime(), UTClastNotified.getTime(), (now.getTime() - lastNotified.getTime()) / 1000, (now.getTime() - UTClastNotified.getTime()) / 1000);
        const diff = (now.getTime() - UTClastNotified.getTime()) / 1000;

        return diff > this.timeout && marker.can_notify === 1 && this.getCurrentNotificationId(marker.id) === null;
    }

    getCurrentNotificationId(markerId:number){
        for (const currentNotification of this.currentNotifications) {
            if(currentNotification.markerId === markerId){
                return currentNotification.notificationId;
            }
        }

        return null;
    }


    sendNotify(marker: MarkerType) {
        // console.log('sended');
        (async (marker) => {
            const {status} = await Notifications.getPermissionsAsync();
            if (status !== 'granted') {
                await Notifications.requestPermissionsAsync();
            }
            const notificationId:string = await Notifications.scheduleNotificationAsync({
                content: {
                    title: "You have place close to you",
                    body: `thats your marker id ${marker.id}`,
                },
                trigger: null,
            });

            this.currentNotifications.push(
                {
                    notificationId:notificationId,
                    markerId:marker.id,
                }
            );

            console.log('notifications', this.currentNotifications);
            // console.log(1, await this.dbProvider.getMarker(marker.id));
            await this.updateLastNotified(marker);
            marker.can_notify = 0;
            // console.log(2, await this.dbProvider.getMarker(marker.id));
            await this.updateCanNotify(marker);
            // console.log(3, await this.dbProvider.getMarker(marker.id));
        })(marker);

    }

    async updateLastNotified(marker: MarkerType) {
        await this.dbProvider.updateLastNotifiedAt(marker.id);
    }

    removeNotification(markerId: number){
        const notificationId = this.getCurrentNotificationId(markerId);
        if(notificationId === null){
            return;
        }else{
            console.log('notification removed', markerId, notificationId);
            Notifications.dismissNotificationAsync(notificationId);
            this.removeFromCurrentNotifications(notificationId);
        }
    }

    removeFromCurrentNotifications(notificationId:string){
        return this.currentNotifications.filter((value)=> value.notificationId !== notificationId);
    }

    async updateCanNotify(marker: MarkerType){
        await this.dbProvider.updateCanNotify(marker.id, marker.can_notify);

    }
    //
    getDistanceToMarker(userMarker: TempMarkerType, marker: MarkerType) {
        const R = 6371;
        const dLat = (userMarker.latitude - marker.latitude) * Math.PI / 180;
        const dLon = (userMarker.longitude - marker.longitude) * Math.PI / 180;
        const a =
            0.5 - Math.cos(dLat) / 2 +
            Math.cos(marker.latitude * Math.PI / 180) * Math.cos(userMarker.latitude * Math.PI / 180) *
            (1 - Math.cos(dLon)) / 2;

        return R * 2 * Math.asin(Math.sqrt(a)) * 1000;
    }

}