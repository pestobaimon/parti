import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../../providers/auth.service';
import { Router } from '@angular/router';
import { partiUser, partiGroup, parties } from '../../models/user.model'
import { partiService } from '../../providers/parti.service';
import * as moment from 'moment';

@Component({
  selector: 'app-parties',
  templateUrl: 'parties.page.html',
  styleUrls: ['parties.page.scss']
})
export class PartiesPage {

  user: partiUser;

  constructor(
    private afAuth: AngularFireAuth,
    private authService: AuthService,
    private router: Router,
    private partiService: partiService
    ) {
      this.partiService.parties$.subscribe(data=>{
        data.forEach(party=>{
          party["expanded"]=false;
        });
        this.parties = data;
      });
      this.partiService.pendingParties$.subscribe(data=>{
        data.forEach(party=>{
          party["expanded"]=false;
        });
        this.pendingParties = data;
        console.log(this.pendingParties);
      });
    }
  
  parties: Array<any> = [];
  pendingParties: Array<any> =[];
  itemExpandHeight: number = 200;

  ngOnInit(){
    this.authService.user$.subscribe(currUser => {
      this.user = currUser;
    });
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
    this.partiService.joinParti(party);
  }
  showMembers(obj:any){

  }

}
