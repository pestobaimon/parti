import { Component } from '@angular/core';
import { GroupService } from '../../providers/group.service';
import { partiGroup, partiUser } from '../../models/user.model';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthService } from '../../providers/auth.service';

@Component({
  selector: 'app-groups',
  templateUrl: 'groups.page.html',
  styleUrls: ['groups.page.scss']
})
export class GroupsPage {

  constructor(
    private groupService : GroupService,
    private afs : AngularFirestore,
    private afAuth : AngularFireAuth,
    private authService : AuthService
  ) {

  }
  groupName:string;
  members:Array<string>;
  groups:Array<any>;
  user:partiUser;
  createGroup(){
    let groupName = 'Ronnyai';
    let members = [this.user];
    this.groupService.createGroup(groupName,members);
    this.queryGroup();
  }
  queryGroup(){
    this.afs.collection('groups').ref
    .where('memberIds','array-contains',this.afAuth.auth.currentUser.uid)
    .get()
    .then(snapshot=>{
      this.groups = [];
      snapshot.forEach(doc=>{
        this.groups.push(doc.data());
      });
    })
  }
  ngOnInit(){
    this.authService.user$.subscribe(userData=>{
      this.user = userData;
    });
    this.queryGroup();
  }
}
