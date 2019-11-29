import { Injectable } from "@angular/core";
import { AngularFirestore, DocumentReference } from 'angularfire2/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertService } from './alert.service';
import { partiGroup, partiUser } from '../models/user.model';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';
import { Router } from '@angular/router';

@Injectable({providedIn:'root'})
export class GroupService{
    constructor(
        private afs: AngularFirestore,
        private alertService: AlertService,
        private router: Router
    ){
    }
    group$: Observable<partiGroup>;
    groupToEdit:string;
    createGroup(groupNameIn:string,members:Array<any>){
        let membersStripped=[];
        let memberIdArr:Array<string> = [];
        members.forEach(member=>{
            membersStripped.push(this.stripUserData(member));
            memberIdArr.push(member.uid);
        });
        const group: partiGroup = 
        {
            groupName: groupNameIn,
            groupId: '',
            members: membersStripped,
            creator: membersStripped[0],
            memberIds: memberIdArr
        }
        this.afs.collection('groups').add(group).then(data => {
            data.update({groupId: data.id});
        });
        this.alertService.inputAlert('group created');
        console.log('group created');
    }
    addMembers(id:string,members:Array<any>){
        const groupRef = this.afs.collection('groups').doc(id);
        let memberIdArray:Array<string> = [];
        members.forEach(member=>{
            memberIdArray.push(member.uid);
        })
        groupRef.update({
            members: firebase.firestore.FieldValue.arrayUnion(...members)
        });
        groupRef.update({   
            memberIds: firebase.firestore.FieldValue.arrayUnion(...memberIdArray)
        });
    }
    updateMembers(groupId:string,newMembers:Array<any>,newMemberIds:Array<string>){
        this.afs.collection('groups').doc(groupId).update({members:newMembers});
        this.afs.collection('groups').doc(groupId).update({memberIds:newMemberIds});
    }
    stripUserData(user:partiUser){
        return {
            displayName: user.displayName,
            uid:user.uid,
            email:user.email
        }
    }
    editGroup(groupId:string){
        this.groupToEdit = groupId;
        this.router.navigate(['edit-group']);
    }
}