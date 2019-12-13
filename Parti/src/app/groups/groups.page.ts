import { Component, Injectable } from '@angular/core';
import { GroupService } from '../../providers/group.service';
import { partiUser } from '../../models/user.model';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthService } from '../../providers/auth.service';
import { Router } from '@angular/router';
import { Events } from '@ionic/angular';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-groups',
  templateUrl: 'groups.page.html',
  styleUrls: ['groups.page.scss']
})
@Injectable({providedIn:'root'})
export class GroupsPage {
  constructor(
    private groupService : GroupService,
    private afs : AngularFirestore,
    private afAuth : AngularFireAuth,
    private authService : AuthService,
    private router: Router,
    private events: Events,
  ){
    this.groupService.getGroups().subscribe(data=>{
      if(data){
        this.groups = data;
      }
    });
    this.authService.getUserData().subscribe(userData=>{
      if(userData){
        this.user = userData;
      }      
    });
  }
  groupName:string;
  members:Array<string>;
  groups:Array<any>;
  user:partiUser;
  createGroup(groupName: string,members: Array<any>){
    this.groupService.createGroup(groupName,members);
  }
  ngOnInit(){
  }
  goToCreateGroup(){
    this.router.navigate(['create-group']);
  }
  editGroup(groupId:string){
    this.groupService.editGroup(groupId);
  }
}
