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
        if (!parti.isFull){
            let isFull : boolean;
            if(parti.memberCount+1 == parti.maxMembers){
                isFull =true;
            }else{
                isFull = false;
            }
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
            const updatedParty: parties = {
                partyId: parti.partyId,
                partyName: parti.partyName,
                partyType: parti.partyType,
                partyLeader: parti.partyLeader,
                minMembers: parti.minMembers,
                maxMembers: parti.maxMembers,
                memberCount: parti.memberCount + 1,
                pendingMemberCount: parti.pendingMemberCount - 1,
                groupNames: parti.groupNames,
                groupIds: parti.groupIds,
                time: parti.time,
                exptime: parti.exptime,
                place: parti.place,
                members: newMembers,
                memberIds: newMemberIds,
                pendingMembers: newPending,
                pendingMemberIds: newPendingUid,
                isFull: isFull,
            }
            this.afs.collection('parties').doc(parti.partyId).update(updatedParty).then(()=>{
                console.log('joined');
            });
        }else{
            this.alertService.inputAlert('Parti Full!');
        }
    }
}
