import { Injectable } from "@angular/core";
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertService } from './alert.service';

@Injectable({providedIn:'root'})
export class AddFriendService{
    constructor(
        private afs : AngularFirestore,
        private afAuth : AngularFireAuth,
        private alertService: AlertService
    ){}
    friendExists: boolean;
    addFriend(friendUid:string){
        const friendRef = this.afs.doc('users/' + friendUid).ref;
        const userUid = this.afAuth.auth.currentUser.uid;
        const userRef = this.afs.doc('users/' + userUid).ref;
        this.afs.collection('users').doc(userUid).get().subscribe( data => {
            if(!data){
                return false;
            }
            let friendList = data.get("friends");
            this.friendExists = false;
            friendList.forEach(a=>{
                if(a.id==friendRef.id){
                    this.friendExists = true;
                }
            });
            if(!this.friendExists){
                friendList.push(friendRef);
                this.afs.collection('users').doc(userUid).update({"friends": friendList});
                console.log('friend added');
                this.alertService.inputAlert('Friend Added!');
            }else{
                console.log('friend already exists');
                this.alertService.inputAlert('Already in friend list!');
            }
        });

        this.afs.collection('users').doc(friendUid).get().subscribe( data => {
            if(!data){
                return false;
            }
            let friendList = data.get("friends");
            this.friendExists = false;
            friendList.forEach(a=>{
                if(a.id==userRef.id){
                    this.friendExists = true;
                }
            });
            if(!this.friendExists){
                friendList.push(userRef);
                this.afs.collection('users').doc(friendUid).update({"friends": friendList});
                console.log('friend added');
            }else{
                console.log('friend already exists');
            }
        });
        
    }
}