import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../providers/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AddFriendService } from '../../providers/addfriend.service';
import { AlertService } from '../../providers/alert.service';
import { partiUser } from '../../models/user.model';
import { take } from 'rxjs/operators'
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-find-friends',
  templateUrl: './find-friends.page.html',
  styleUrls: ['./find-friends.page.scss'],
})
export class FindFriendsPage implements OnInit {

  constructor(
    private authService: AuthService,
    private navCtrl : NavController,
    private afs: AngularFirestore,
    private addFriendService: AddFriendService,
    private alertService : AlertService
  ) { }

  ngOnInit() {
  }

  friendList: Array<any>;
  email:string;
  
  findUser(emailIn:string){
    const email = emailIn.toLowerCase();
    this.authService.getUserData().subscribe( currUser =>{
      if(currUser.email.toLowerCase() == email){
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
  goBack(){
    this.navCtrl.back();
  }
  addUser(friend:partiUser){
    this.addFriendService.addFriend(friend);
  }
}
