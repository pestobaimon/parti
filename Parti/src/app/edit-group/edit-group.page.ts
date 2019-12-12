import { Component, OnInit } from '@angular/core';
import { GroupService } from '../../providers/group.service';
import { AuthService } from '../../providers/auth.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { partiUser, partiGroup } from '../../models/user.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Events } from '@ionic/angular';
import { AlertService } from '../../providers/alert.service';

@Component({
  selector: 'app-edit-group',
  templateUrl: './edit-group.page.html',
  styleUrls: ['./edit-group.page.scss'],
})
export class EditGroupPage implements OnInit {

  constructor(
    private fb: FormBuilder,
    private groupService: GroupService,
    private authService: AuthService,
    private afs: AngularFirestore,
    private router: Router,
    private events: Events,
    private alertService: AlertService
  ) {}
  addUserForm:FormGroup;
  members:Array<any>;
  membersWithoutCurrUser:Array<any>;
  nonMembers:Array<any>;
  groupId:string = this.groupService.groupToEdit;
  group:partiGroup;
  user:partiUser;
  ngOnInit() {
    this.authService.user$.subscribe(data=>{
      this.user = data;
      this.afs.collection('groups').doc<partiGroup>(this.groupId)
        .valueChanges()
        .subscribe(data=>{
          this.group = data;
          this.members = data.members;
          this.membersWithoutCurrUser = [];
          let memberIds = [];
          this.members.forEach(member=>{
            memberIds.push(member.uid);
            if(member.uid != this.user.uid){
              this.membersWithoutCurrUser.push(member);
            }
          });
          this.nonMembers = [];
          let fbNonMemberArgs = {};
          this.nonMembers = this.user.friends.filter(item => memberIds.indexOf(item.uid) < 0);
          this.nonMembers.forEach(user => {
            fbNonMemberArgs[user.uid] = []
          });

          this.addUserForm = this.fb.group(fbNonMemberArgs);
        })
    });
  }
  addMembers(){
    let membersToAdd:Array<any> = [];
    this.nonMembers.forEach(user=>{
      if(this.addUserForm.get(user.uid).value){
        membersToAdd.push(user);
      }
    });
    console.log(membersToAdd);
    this.groupService.addMembers(this.groupId,membersToAdd);
  }
  confirmRemove(memberUidToRemove:string,memberName:string){
    this.alertService.removeMemberAlert(memberName);
    this.events.subscribe('user:removeMember',()=>{
      this.groupService.removeMember(memberUidToRemove,this.group);
    });
  }
  back(){
    this.router.navigate(['tabs/groups']);
  }
  leaveGroup(){
    this.alertService.leaveGroupAlert();
    this.events.subscribe('user:leaveGroup',()=>{
      this.groupService.removeMember(this.user.uid,this.group);
      console.log(this.user.uid,'left');
      this.back();
    });
  }
}
