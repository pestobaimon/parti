import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../../providers/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(
    public afAuth: AngularFireAuth,
    public authService: AuthService,
    public router: Router) {}
  
  displayName(){
    this.authService.user$.pipe().subscribe(user =>{
      console.log(user.displayName);
    })
  }
  signOut(){
    this.afAuth.auth.signOut().then(()=>{
      location.reload();
    });
  }
  ngOnInit(){
    if(!this.afAuth.auth.currentUser){
      this.router.navigate(['/login'])
    }
  }
}
