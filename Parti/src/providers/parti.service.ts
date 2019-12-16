import { Injectable } from "@angular/core";
import { AngularFirestore } from '@angular/fire/firestore';
import { parties, partiUser } from '../models/data.model';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertService } from './alert.service';
import { AuthService } from './auth.service';

import * as $ from 'jquery';

import { Router } from '@angular/router';


@Injectable({providedIn:'root'})
export class PartiService{
    constructor(
        private afs:AngularFirestore,
        private afAuth: AngularFireAuth,
        private alertService: AlertService,
        private authService: AuthService,
        private router: Router
    ){    
        this.authService.getUserData().subscribe(data=>{
            this.user = data;
        });
        this.acceptedCollection.valueChanges().subscribe(partiArray => {
            partiArray.forEach(parti => { 
                if(parti.exptime.seconds<Math.floor(Date.now() / 1000)){
                    this.afs.collection('parties').doc(parti.partyId).update({isExpired:true});
                }else{
                    console.log('parti not expired');
                }
            });
        });
        this.pendingCollection.valueChanges().subscribe(partiArray => {
            partiArray.forEach(parti => { 
                if(parti.exptime.seconds<Math.floor(Date.now() / 1000)){
                    this.afs.collection('parties').doc(parti.partyId).update({isExpired:true});
                }else{
                    console.log('parti not expired');
                }
            });
        });
    }
    private user:partiUser;
    private uid = this.afAuth.auth.currentUser.uid;
    private pendingCollection = this.afs.collection<parties>('parties',ref => ref.where('isExpired','==',false).where('pendingMemberIds','array-contains',this.uid));
    private acceptedCollection = this.afs.collection<parties>('parties',ref=> ref.where('isExpired','==',false).where('memberIds','array-contains',this.uid))
    public partiIDtoshow:string;

    getOngoingParties():Observable<any[]>{
        return this.acceptedCollection.valueChanges();
    }

    getPendingParties():Observable<any[]>{
        return this.pendingCollection.valueChanges();
    }

    createParty(parti:parties){
        this.afs.collection('parties').add(parti).then(data=>{
            data.update({partyId : data.id});
            this.alertService.dismissLoader();
            this.alertService.inputAlert('Parti Created!');
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
                isExpired: parti.isExpired
            }
            this.afs.collection('parties').doc(parti.partyId).update(updatedParty).then(()=>{
                console.log('joined');
            });
        }else{
            this.alertService.inputAlert('Parti Full!');
        }
    }

    removeMember(memberToRemove:any,parti:parties){
        let newMembers = $.grep(parti.members, member =>{
            return member.uid != memberToRemove.uid;
        });
        let newMemberIds = $.grep(parti.memberIds, memberId =>{
            return memberId != memberToRemove.uid;
        });
        let newPending = parti.pendingMembers;
        let newPendingIds = parti.pendingMemberIds;
        newPending.push(memberToRemove);
        newPendingIds.push(memberToRemove.uid);
        const updatedParty: parties = {
            partyId: parti.partyId,
            partyName: parti.partyName,
            partyType: parti.partyType,
            partyLeader: parti.partyLeader,
            minMembers: parti.minMembers,
            maxMembers: parti.maxMembers,
            memberCount: parti.memberCount - 1,
            pendingMemberCount: parti.pendingMemberCount + 1,
            groupNames: parti.groupNames,
            groupIds: parti.groupIds,
            time: parti.time,
            exptime: parti.exptime,
            place: parti.place,
            members: newMembers,
            memberIds: newMemberIds,
            pendingMembers: newPending,
            pendingMemberIds: newPendingIds,
            isFull: false,
            isExpired: parti.isExpired
        }
        this.afs.collection('parties').doc(parti.partyId).update(updatedParty).then(()=>{
            console.log('removed member: ',memberToRemove.uid);
        });
    }

    partiDetail(partiID:string){
        this.partiIDtoshow = partiID;
        this.router.navigate(["parti-detail"]);

    }
}
