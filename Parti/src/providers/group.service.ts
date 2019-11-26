import { Injectable } from "@angular/core";
import { AngularFirestore, DocumentReference } from 'angularfire2/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertService } from './alert.service';
import { partiGroup } from '../models/user.model';
import { AuthService } from './auth.service';
import { switchMap, take } from 'rxjs/operators'

@Injectable({providedIn:'root'})
export class GroupService{
    constructor(
        private afs: AngularFirestore,
        private alertService: AlertService,
        private afAuth : AngularFireAuth,
        private authService: AuthService
    ){
    }
    groups: Array<DocumentReference>;
    createGroup(groupNameIn:string,memberList:Array<string>){
        let membersRef:Array<DocumentReference>=[];
        memberList.forEach(uid=>{
            membersRef.push(this.afs.doc('users/' + uid).ref);
        });
        let group: partiGroup = {
            groupName: groupNameIn,
            members: membersRef,
            groupId: '',
        };
        this.afs.collection('groups').add(group).then(docRef=> {
            docRef.update({groupId:docRef.id});
            console.log('group created!');
            memberList.forEach(uid=>{
                this.addGroup(uid,docRef);
                console.log('group added to '+uid);
            })
            
        });

    }
    addGroup(uid:string,docRef:DocumentReference){
        this.afs.collection('users').doc(uid).get().subscribe(data=>{
            if(data.get('groups')){
                let currGroups:Array<DocumentReference> = data.get('groups');
                currGroups.push(docRef);
                this.afs.collection('users').doc(uid).update({'groups':currGroups});
            }else{
                this.afs.collection('users').doc(uid).update({'groups':[docRef]});
            }
        });
    }
    addMembers(groupId:string,memberList:Array<string>){
        let membersRef:Array<DocumentReference>=[];
        memberList.forEach(uid=>{
            membersRef.push(this.afs.doc('users/' + uid).ref);
        });
        this.afs.collection('groups').doc(groupId).get().subscribe(data=>{
            let currMembers:Array<DocumentReference> = data.get('members');
            currMembers.concat(membersRef);
            this.afs.collection('groups').doc(groupId).update({'members':currMembers});
        })
    }
    getGroups(){
        const user = this.afAuth.auth.currentUser.uid;
        this.afs.collection('users').doc(user).get().subscribe(data=>{
            this.groups = data.get('groups');
        });
    }
}