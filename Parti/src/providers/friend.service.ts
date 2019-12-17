import { Injectable } from '@angular/core';
import { partiUser } from 'src/models/data.model';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class FriendService {
    friendUidToView: string;
    constructor(
        private router: Router,
        private afs: AngularFirestore
    ){
    }

    goToFriendProfile(friendUid:string){
        this.friendUidToView = friendUid;
        this.router.navigate(['friend-profile']);
    }
    getFriendData(): Observable<partiUser>{
        return this.afs.collection('users').doc<partiUser>(this.friendUidToView).valueChanges();
    }
}