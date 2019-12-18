import { Injectable } from '@angular/core';
import { AlertService } from './alert.service';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';

@Injectable({providedIn:'root'})
export class NotificationService{
    constructor(
        private alertService: AlertService,
        private afs: AngularFirestore
    ){}
    addNotification(notification:string,uid:string){
        this.afs.collection('users').doc(uid).update({notifications: firebase.firestore.FieldValue.arrayUnion(notification)});
    }
    readNotifications(notificationList:Array<string>){
        notificationList.forEach(notification=>{
            this.alertService.inputAlert(notification);
        });
    }
    clearNotifications(uid:string){
        this.afs.collection('users').doc(uid).update({notifications:[]});
    }
}