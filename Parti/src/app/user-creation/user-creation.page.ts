import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../providers/auth.service';
import { AlertService } from '../../providers/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-creation',
  templateUrl: './user-creation.page.html',
  styleUrls: ['./user-creation.page.scss'],
})
export class UserCreationPage implements OnInit {

  constructor(
    private authService : AuthService,
    private alertService : AlertService,
    private router : Router
  ) { }

  setDisplayName(name:string){
    if(!name){
      this.alertService.inputAlert('Name cannot be empty!');
    }else{
      this.authService.updateDisplayName(name);
    }
  }
  ngOnInit() {
  }
  goToProfilePage(){
    this.router.navigate(['/tabs/user-profile']);
  }
}
