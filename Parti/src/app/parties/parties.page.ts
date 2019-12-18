import { Component, OnDestroy } from '@angular/core';
import { AuthService } from '../../providers/auth.service';
import { Router } from '@angular/router';
import { partiUser, parties } from '../../models/data.model'
import { PartiService } from '../../providers/parti.service';
import * as moment from 'moment';
import { takeUntilNgDestroy } from 'take-until-ng-destroy';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NotificationService } from 'src/providers/notification.service';

@Component({
  selector: 'app-parties',
  templateUrl: 'parties.page.html',
  styleUrls: ['parties.page.scss']
})
export class PartiesPage implements OnDestroy {
  unsubscribe$: Subject<void>;
  user: partiUser;
  onGoingParties: Array<any>;
  pendingParties: Array<any>;
  itemExpandHeight: number = 200;
  constructor(
    private authService: AuthService,
    private router: Router,
    private partiService: PartiService,
    private notificationService: NotificationService
    ) {
      this.unsubscribe$  = new Subject<void>();
      this.onGoingParties = [];
      this.pendingParties = [];
      this.authService.getUserData().pipe(takeUntilNgDestroy(this)).subscribe(currUser => { /**currUser is emitted data */
        if(currUser){
          this.user = currUser;
          if(currUser.notifications){
            this.notificationService.readNotifications(currUser.notifications);
            this.notificationService.clearNotifications(currUser.uid);
          }
          console.log(currUser);
        }
      }); /**always update change in current user */
      this.partiService.refresh$.pipe(takeUntilNgDestroy(this)).subscribe(()=>{
        this.refreshParty();
      });
      this.partiService.refresh$.next();
    }

  refreshParty(){
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.partiService.getOngoingParties().pipe(takeUntil(this.unsubscribe$)).subscribe(data=>{
      if(data && data.length){
        data.forEach(party=>{
          party["expanded"]=false;
        });
        this.onGoingParties = data;
      }else{
        this.onGoingParties = [];
      }
    });
    this.partiService.getPendingParties().pipe(takeUntil(this.unsubscribe$)).subscribe(data=>{
      if(data){
        data.forEach(party=>{
          party["expanded"]=false;
        });
        this.pendingParties = data;
      }else{
        this.pendingParties = [];
      }   
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

  ngOnDestroy(){
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
