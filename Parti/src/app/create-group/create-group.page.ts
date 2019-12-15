import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../providers/auth.service';
import { partiUser } from '../../models/user.model';
import { GroupService } from '../../providers/group.service';
import { Router } from '@angular/router';
import { Events } from '@ionic/angular';
import { AlertService } from '../../providers/alert.service';
@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.page.html',
  styleUrls: ['./create-group.page.scss'],
})
export class CreateGroupPage implements OnInit {
  form:FormGroup;
  user:partiUser;
  friendArray: Array<any>;
  groupMembers: Array<any>;
  groupName:string;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private groupService : GroupService,
    private events: Events,
    private alertService : AlertService
  ) {}
  ngOnInit() {
    this.authService.getUserData().subscribe(data=>{
      if(data){
        this.friendArray = data.friends;
        this.user = data;
        let fbargs = {};
        this.friendArray.forEach(friend => {
          fbargs[friend.uid] = []});
        this.form = this.fb.group(fbargs);
      }
    })
  }
  
  createGroup(groupName: string){
    if(groupName){
    this.groupMembers = []
    let currUser = {
      displayName : this.user.displayName,
      email: this.user.email,
      uid: this.user.uid
    }
    this.groupMembers.push(currUser); /**append member */

    this.friendArray.forEach(friend=>{
      if(this.form.get(friend.uid).value){
        this.groupMembers.push(friend);
      }
    });
    this.groupService.createGroup(groupName,this.groupMembers);
    }else{
      this.alertService.inputAlert("Please enter group name");
    }
  }
  goToGroupsPage(){
    this.router.navigate(['tabs/groups']).then(()=>{
      this.events.publish('group:edited');
    });
  }
}
