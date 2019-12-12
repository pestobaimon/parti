import { Injectable } from "@angular/core";
import { AlertController, LoadingController, Events } from '@ionic/angular';

@Injectable({providedIn:'root'})
export class AlertService{
  constructor(public alertController: AlertController,
              public loadingController: LoadingController,
              private events: Events
              ){}

  async presentLoading(){
      const loading = await this.loadingController.create({
        message: "please wait...",
      });
      await loading.present();
      const { role, data } = await loading.onDidDismiss();
      console.log('Loading dismissed!');
  }
  dismissLoader(){
      this.loadingController.dismiss();
  }
  async inputAlert(text:string){
      const alert = await this.alertController.create({
        message: text,
        buttons: [
          {
            text: 'Close',
            role: 'cancel',
            handler: data => {
              console.log('Cancel clicked');
            }
          }
        ]
      });
      await alert.present();
      let result = await alert.onDidDismiss();
      console.log(result);
  }
  async leaveGroupAlert(){
    const alert = await this.alertController.create({
      message: "If you leave this group, you'll no longer be receiving invitations from this group. Continue?",
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'OK',
          handler: data => {
            this.events.publish('user:leaveGroup');
          }
        }
      ]
    });
    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result)
  }

  async SignOutAlert(){
    const alert = await this.alertController.create({
      message: "Sign out?",
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'OK',
          handler: data => {
            this.events.publish('user:logout');
          }
        }
      ]
    });
    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result)
  }

  async removeMemberAlert(name:string){
    const alert = await this.alertController.create({
      message: ("Remove "+name+" from group?"),
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'OK',
          handler: data => {
            this.events.publish('user:removeMember');
          }
        }
      ]
    });
    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result)
  }

  async createPartiAlert(){
    const alert = await this.alertController.create({
      message: ("Start Parti?"),
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'OK',
          handler: data => {
            this.presentLoading();
            this.events.publish('parti:start');
          }
        }
      ]
    });
    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result)
  }

  


}