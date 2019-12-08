import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../providers/auth.service';
import { partiUser } from '../../models/user.model';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertService } from '../../providers/alert.service';
import { Events } from '@ionic/angular';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage {
  user: partiUser;
  friends: Array<any>;
  constructor(
    private authService: AuthService,
    private router : Router,
    private afAuth : AngularFireAuth,
    private alertService: AlertService,
    private events: Events
  ) { }

  ngOnInit() {
    this.authService.user$.subscribe(currUser => {
      this.user = currUser;
      this.friends = this.user.friends;
    });
  }

  goToFindFriendsPage(){
    this.router.navigate(['/find-friends']);
  }
  goToChangeDisplayName(){
    this.router.navigate(['/user-creation']);
  }
  signOut(){
    this.alertService.SignOutAlert();
    this.events.subscribe('user:logout',()=>{
      this.afAuth.auth.signOut().then(()=>{
        location.reload();
      });
    });
  }
}
