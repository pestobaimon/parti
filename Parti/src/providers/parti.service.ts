import { Injectable } from "@angular/core";
import { AngularFirestore, DocumentReference } from 'angularfire2/firestore';
import { parties, partiUser } from '../models/user.model';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertService } from './alert.service';
import { AuthService } from './auth.service';

@Injectable({providedIn:'root'})
export class partiService{
    constructor(
        private afs:AngularFirestore,
        private afAuth: AngularFireAuth,
        private alertService: AlertService,
        private authService: AuthService
    ){
        
        this.pendingParties$ = this.pendingCollection.valueChanges();
        this.authService.user$.subscribe(data=>{
            this.user = data;
        })
        this.parties$ = this.acceptedCollection.valueChanges();

    }
    private user:partiUser;
    private uid = this.afAuth.auth.currentUser.uid;
    private pendingCollection = this.afs.collection('parties',ref => ref.where('pendingMemberIds','array-contains',this.uid));
    private acceptedCollection = this.afs.collection('parties',ref=> ref.where('memberIds','array-contains',this.uid))

    public pendingParties$:Observable<any[]>;
    public parties$:Observable<any[]>;
    createParty(parti:parties){
        this.afs.collection('parties').add(parti).then(data=>{
            data.update({partyId : data.id});
            this.alertService.inputAlert('Parti Created!');
            console.log('parti created!');
        });
    }

    joinParti(parti:parties){
        var newPending = [];
        var newPendingUid = [];
        var newMembers = [];
        var newMemberIds = [];
        parti.pendingMembers.forEach(member=>{
            if(member.uid!=this.uid){
                newPending.push(member);
                newPendingUid.push(member.uid);
            }
        });
        const currUser = {
            displayName : this.user.displayName,
            email: this.user.email,
            uid: this.user.uid
        }
        newMembers = parti.members;
        newMemberIds = parti.memberIds;
        newMembers.push(currUser);
        newMemberIds.push(this.uid);
        this.afs.collection('parties').doc(parti.partyId).update({
            members: newMembers,
            memberIds: newMemberIds,
            pendingMembers: newPending,
            pendingMemberIds: newPendingUid
        }).then(()=>{
            console.log('joined');
        });
    }
}