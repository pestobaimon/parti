import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../providers/auth.service';
import { partiUser } from '../../models/user.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {
  user: any = {};
  friends = [];

  constructor(
    private authService: AuthService,
    private router : Router
  ) { }

  ngOnInit() {
    this.authService.user$.subscribe(userdata=>{
      this.user = userdata;
      if(userdata.friends){
        userdata.friends.forEach(friend => {
          friend.get().then(res =>{
            let f: partiUser ={
              uid: res.data().uid,
              displayName: res.data().displayName,
              email: res.data().email,
            }
            this.friends.push(f);
          })
        }); 
      }
    })
  }

  goToFindFriendsPage(){
    this.router.navigate(['/find-friends']);
  }
  goToChangeDisplayName(){
    this.router.navigate(['/user-creation']);
  }
}
