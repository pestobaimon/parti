import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../providers/auth.service';
import { Router } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { AddFriendService } from '../../providers/addfriend.service';
import { AlertService } from '../../providers/alert.service';
import { partiUser } from '../../models/user.model';
import { take } from 'rxjs/operators'


@Component({
  selector: 'app-find-friends',
  templateUrl: './find-friends.page.html',
  styleUrls: ['./find-friends.page.scss'],
})
export class FindFriendsPage implements OnInit {

  constructor(
    private authService: AuthService,
    private router : Router,
    private afs: AngularFirestore,
    private addFriendService: AddFriendService,
    private alertService : AlertService
  ) { }

  ngOnInit() {

  }

  friendList: Array<any>;
  
  findUser(email:string){
    this.authService.user$.subscribe( currUser =>{
      if(currUser.email == email){
        console.log("That's your email!");
        this.alertService.inputAlert("That's your email!");
      }else if(!email){
        this.alertService.inputAlert("Email cannot be empty!");
      }
      else{
        return this.afs.collection('users', ref => ref.where('email', '==' , email ))
          .snapshotChanges()
          .pipe(take(1))
          .subscribe(response => {
              if(!response){
                  console.log('user not found');            
              }else{
                  this.friendList = [];
                  response.forEach(a =>{
                      let friend:any = a.payload.doc.data()
                      this.friendList.push(friend);
                      console.log(this.friendList);
                  })
              }
          });
      }
    });
  }
  goToProfilePage(){
    this.router.navigate(['/tabs/user-profile']);
  }
  addUser(friend:partiUser){
    this.addFriendService.addFriend(friend);
  }
}
