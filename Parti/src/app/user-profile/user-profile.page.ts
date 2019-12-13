import { Component } from '@angular/core';
import { AuthService } from '../../providers/auth.service';
import { partiUser } from '../../models/user.model';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertService } from '../../providers/alert.service';
import { Events } from '@ionic/angular';
import { PhotoService } from '../../providers/photo.service';


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
    private events: Events,
    private photoService: PhotoService
  ) {
    this.authService.getUserData().subscribe(currUser => {
      if(currUser){
        this.user = currUser;
        this.friends = this.user.friends;
      }
    });
  }

  goToFindFriendsPage(){
    this.router.navigate(['/find-friends']);
  }
  goToEditName(){
    this.router.navigate(['/edit-name']);
  }
  signOut(){
    this.alertService.SignOutAlert();
    this.events.subscribe('user:logout',()=>{
      this.afAuth.auth.signOut().then(()=>{
        location.reload();
      });
    });
  }
  changeProfilePic(){
    this.photoService.getFromGallery();
  }
}
