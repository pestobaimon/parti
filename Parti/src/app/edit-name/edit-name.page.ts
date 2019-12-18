import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../providers/auth.service';
import { AlertService } from '../../providers/alert.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-edit-name',
  templateUrl: './edit-name.page.html',
  styleUrls: ['./edit-name.page.scss'],
})
export class EditNamePage {

  displayName:string;
  constructor(
    private authService : AuthService,
    private alertService : AlertService,
    private navCtrl : NavController
  ) { }

  setDisplayName(name:string){
    if(!name){
      this.alertService.inputAlert('Name cannot be empty!');
    }else{
      this.authService.updateDisplayName(name);
    }
  }
  goBack(){
    this.navCtrl.back();
  }
}
