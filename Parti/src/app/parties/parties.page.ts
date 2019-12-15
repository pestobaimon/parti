import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../../providers/auth.service';
import { Router } from '@angular/router';
import { partiUser, parties } from '../../models/user.model'
import { PartiService } from '../../providers/parti.service';
import * as moment from 'moment';

@Component({
  selector: 'app-parties',
  templateUrl: 'parties.page.html',
  styleUrls: ['parties.page.scss']
})
export class PartiesPage {

  user: partiUser;
  parties: Array<any>;
  pendingParties: Array<any>;
  itemExpandHeight: number = 200;

  constructor(
    private afAuth: AngularFireAuth,
    private authService: AuthService,
    private router: Router,
    private partiService: PartiService
    ) {
      this.parties = [];
      this.pendingParties = [];
      this.authService.getUserData().subscribe(currUser => { /**currUser is emitted data */
        if(currUser){
          this.user = currUser;
          console.log(currUser);
        }
      }); /**always update change in current user */
      this.partiService.getOngoingParties().subscribe(data=>{
        if(data && data.length){
          console.log('parties found');
          data.forEach(party=>{
            party["expanded"]=false;
          });
          this.parties = data;
        }
      });
      this.partiService.getPendingParties().subscribe(data=>{
        if(data){
          data.forEach(party=>{
            party["expanded"]=false;
          });
          this.pendingParties = data;
          console.log(this.pendingParties);
        }        
      });
    }

  ngOnInit(){
  }
  goToPage(page:string){
    this.router.navigate([page]);
  }
  getUser(){
    console.log(this.user);
  }
  convertTimeStamp(timestamp:any){
    const time = Number(timestamp.seconds);
    return moment.unix(time).format('DD/MM/YYYY');
  } 

  expandToggle(obj:any,type:string){
    if(type=="card"){
      if(obj.expanded){
        obj.memberExpanded = !obj.memberExpanded;
      }
      obj.expanded = !obj.expanded;
    }else{
      obj.memberExpanded = !obj.memberExpanded;
    }
  }
  joinParty(party:parties){
    this.partiService.joinParti(party); //h
  }
  leaveParty(party:parties){
    let memberToRemove = {
      uid: this.user.uid,
      displayName: this.user.displayName,
      email: this.user.email
    }
    this.partiService.removeMember(memberToRemove,party);
  }
  partiDetail(partiID:string){
    this.partiService.partiDetail(partiID);
  }
}
