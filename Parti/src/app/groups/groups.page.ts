import { Component } from '@angular/core';
import { GroupService } from '../../providers/group.service';
import { partiGroup } from '../../models/user.model';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'app-groups',
  templateUrl: 'groups.page.html',
  styleUrls: ['groups.page.scss']
})
export class GroupsPage {

  constructor(
    private groupService : GroupService,
    private afs : AngularFirestore,
    private afAuth : AngularFireAuth
  ) {

  }
  groupName:string;
  members:Array<string>;
  groups:Array<any>;

  createGroup(){
    let groupName = 'Ronnyai'
    let members = ['e3ZnuB4NxuSBdHxGYGaiq5AO0Ql2','12ZOS1NJknY87iGZ8klKvreQpdC3','7HykjQs692NJuHoLIyOX9RFefbp2'];
    this.groupService.createGroup(groupName,members);
    this.getGroups();
  }
  ngOnInit(){
    this.getGroups();
  }
  getGroups(){
    const user = this.afAuth.auth.currentUser.uid;
    this.afs.collection('users').doc(user).get().subscribe(data=>{
      this.groups=[];
      data.get('groups').forEach(groupRef => {
        this.afs.collection('groups').doc(groupRef.id).valueChanges().subscribe(groupData=>{
          this.groups.push(groupData);
        })
      });
    });
  }
}
