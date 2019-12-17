import { Component, OnDestroy } from '@angular/core';
import { partiUser } from 'src/models/data.model';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertService } from 'src/providers/alert.service';
import { Events, NavController } from '@ionic/angular';
import { PhotoService } from 'src/providers/photo.service';
import { FriendService } from 'src/providers/friend.service';
import { takeUntilNgDestroy } from 'take-until-ng-destroy';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-friend-profile',
  templateUrl: './friend-profile.page.html',
  styleUrls: ['./friend-profile.page.scss'],
})
export class FriendProfilePage implements OnDestroy{
  user: partiUser;
  friends: Array<any>;
  refresh$ : Subject<void>;
  constructor(
    private friendService: FriendService,
    private navCtrl: NavController
  ) {
    this.refresh$  = new Subject<void>();
    this.refresh$.pipe(takeUntilNgDestroy(this)).subscribe(()=>{
      this.friendService.getFriendData().pipe(takeUntil(this.refresh$)).subscribe(currUser => {
        if(currUser){
          this.user = currUser;
          this.friends = this.user.friends;
        }
      });
    });
    this.refresh$.next();
  }
  goBack(){
    this.navCtrl.back();
  }
  ngOnDestroy(){
    this.refresh$.next();
    this.refresh$.complete();
  }
  viewProfile(uid:string){
    this.friendService.goToFriendProfile(uid);
    this.refresh$.next();
  }

}
