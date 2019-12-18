import { Injectable } from "@angular/core";
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertService } from './alert.service';
import { partiGroup, partiUser } from '../models/data.model';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import * as $ from 'jquery';

@Injectable({providedIn:'root'})
export class GroupService{
    constructor(
        private afs: AngularFirestore,
        private alertService: AlertService,
        private router: Router,
        private afAuth: AngularFireAuth
    ){}

    collection = this.afs.collection('groups', ref => ref.where('memberIds','array-contains',this.afAuth.auth.currentUser.uid));
    groupToEdit:string;
    
    getGroups():Observable<any[]>{
        return this.collection.valueChanges();
    }
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
    updateMembers(groupId:string,newMembers:Array<partiGroup>,newMemberIds:Array<string>){
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
    removeMember(memberUidToRemove:string,group:partiGroup){
        let newMembers = $.grep(group.members, function(member){ 
          return member.uid != memberUidToRemove; 
        });
        let newMemberIds = $.grep(group.memberIds, function(uid){
          return uid != memberUidToRemove;
        });
        this.updateMembers(group.groupId,newMembers,newMemberIds);
    }
}