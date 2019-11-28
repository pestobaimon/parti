import { Injectable } from "@angular/core";
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertService } from './alert.service';
import { AuthService } from './auth.service';
import { take } from 'rxjs/operators'
import { partiUser } from '../models/user.model';
import * as firebase from 'firebase';


@Injectable({providedIn:'root'})
export class AddFriendService{
    constructor(
        private afs : AngularFirestore,
        private afAuth : AngularFireAuth,
        private alertService: AlertService,
        private authService: AuthService
    ){
        this.authService.user$.subscribe(data=>{
            if(data){
                this.user=data;
            }
        })
    }
    user:partiUser;
    friendExists: boolean;
    
    addFriend(friendIn:partiUser){
        this.authService.user$.pipe(take(1)).subscribe(user=>{
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
                    friends: firebase.firestore.FieldValue.arrayUnion(friendData)
                });
                this.afs.collection('users').doc(friendIn.uid).update({
                    friends: firebase.firestore.FieldValue.arrayUnion(userData)
                });
                this.afs.collection('users').doc(user.uid).update({
                    friendIds: firebase.firestore.FieldValue.arrayUnion(friendData.uid)
                });
                this.afs.collection('users').doc(friendIn.uid).update({
                    friendIds: firebase.firestore.FieldValue.arrayUnion(userData.uid)
                });
                this.alertService.inputAlert('Friend added!');
            }
        });

   }
}