import { Injectable } from "@angular/core";
import { AngularFirestore } from '@angular/fire/firestore';
import { AlertService } from './alert.service';
import { AuthService } from './auth.service';
import { take } from 'rxjs/operators'
import { partiUser } from '../models/data.model';
import * as firebase from 'firebase';
import { NotificationService } from './notification.service';


@Injectable({providedIn:'root'})
export class AddFriendService{
    constructor(
        private afs : AngularFirestore,
        private notificationService:NotificationService,
        private alertService: AlertService,
        private authService: AuthService
    ){}
    user:partiUser;
    friendExists: boolean;
    
    addFriend(friendIn:partiUser){
        this.authService.getUserData().pipe(take(1)).subscribe(user=>{
            this.friendExists = false;
            user.friends.forEach(friend=>{
                if(friend.uid == friendIn.uid){
                    this.friendExists = true;
                    this.alertService.inputAlert('Already in friend list!');
                }
            });
            if(!this.friendExists){
                let userData = {
                    displayName: user.displayName,
                    uid: user.uid,
                    email: user.email
                }
                let friendData = {
                    displayName: friendIn.displayName,
                    uid: friendIn.uid,
                    email: friendIn.email
                }
                this.afs.collection('users').doc(user.uid).update({
                    friends: firebase.firestore.FieldValue.arrayUnion(friendData),
                    friendIds: firebase.firestore.FieldValue.arrayUnion(friendData.uid)
                });
                this.afs.collection('users').doc(friendIn.uid).update({
                    friendIds: firebase.firestore.FieldValue.arrayUnion(userData.uid),
                    friends: firebase.firestore.FieldValue.arrayUnion(userData)
                });
                this.notificationService.addNotification((user.displayName+' has added you!'),friendIn.uid);
                this.alertService.inputAlert('Friend added!');
            }
        });

   }
}