import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../../providers/auth.service';
import { Router } from '@angular/router';
import { partiUser, partiGroup, parties } from '../../models/user.model'

@Component({
  selector: 'app-parties',
  templateUrl: 'parties.page.html',
  styleUrls: ['parties.page.scss']
})
export class PartiesPage {

  constructor(
    public afAuth: AngularFireAuth,
    public authService: AuthService,
    public router: Router) {}
  
  mockUser0: partiUser = {
    uid: 'mockuid',
    displayName: 'Mon',
    email: 'baba@gmail.com',
    friends: [this.authService.currentUser]
  }
  mockUser1: partiUser = {
    uid: 'mockuid',
    displayName: 'HaleeHuu',
    email: 'baba@gmail.com',
    friends: [this.authService.currentUser]
  }
  mockParties1: parties = {
    partyId: "JnL19XnCnZnKdnou0AMn",
    partyName: "TrueCoffe jaa",
    partyType: "Study",
    partyLeader: this.mockUser0, //for now let current user be leader
    minMembers: 3,
    maxMembers: 5,
    memberCount: 1,
    friends: [],
    time: new Date(Date.UTC(2019, 11, 20, 3, 0, 0)),
    exptime: new Date(Date.UTC(2019, 11, 19, 3,0,0)),
    place: "True Coffee Scala"
  }
  mockParties2: parties = {
    partyId: "hadiajdklasdnkl",
    partyName: "อ่านหนังสือกันเถอะ",
    partyType: "Study",
    partyLeader: this.mockUser0, //for now let current user be leader
    minMembers: 3,
    maxMembers: 5,
    memberCount: 1,
    friends: [],
    time: new Date(Date.UTC(2019, 11, 20, 3, 0, 0)),
    exptime: new Date(Date.UTC(2019, 11, 19, 3,0,0)),
    place: "โต๊ะส้ม"
  }
  parties: Array<parties> = [
    this.mockParties1,
    this.mockParties2
  ]
  displayName(){
    console.log(this.authService.currentUser);
  }
  getUser(){
    this.authService.saveUserToLocal();
  }
  signOut(){
    this.afAuth.auth.signOut().then(()=>{
      location.reload();
    });
  }
  ngOnInit(){
    /*if(!this.afAuth.auth.currentUser){
      this.router.navigate(['/login'])
    }*/
  }
  goToPage(page:string){
    this.router.navigate([page]);
  }
}
