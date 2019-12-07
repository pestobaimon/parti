import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../providers/auth.service';
import { partiUser } from '../../models/user.model';
import { AngularFirestore } from 'angularfire2/firestore';
import { GroupService } from '../../providers/group.service';
import { Router } from '@angular/router';
import { Events } from '@ionic/angular';

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
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private groupService : GroupService,
    private events: Events
  ) {}
  ngOnInit() {
    this.authService.user$.subscribe(data=>{
      this.friendArray = [];
      this.user = data;
      let fbargs = {};
      this.user.friends.forEach(friend=>{
        this.friendArray.push(friend);
      });
      //console.log(this.friendArray);
      this.friendArray.forEach(friend => {
        fbargs[friend.uid] = []});
      this.form = this.fb.group(fbargs);
    })
  }
  
  createGroup(groupName: string){
    this.groupMembers = []
    let currUser = {
      displayName : this.user.displayName,
      email: this.user.email,
      uid: this.user.uid
    }
    this.groupMembers.push(currUser);

    this.friendArray.forEach(friend=>{
      if(this.form.get(friend.uid).value){
        this.groupMembers.push(friend);
      }
    });
    this.groupService.createGroup(groupName,this.groupMembers);
  }
  goToGroupsPage(){
    this.router.navigate(['tabs/groups']).then(()=>{
      this.events.publish('group:edited');
    });
  }
}
