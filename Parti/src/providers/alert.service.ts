import { Injectable } from "@angular/core";
import { AlertController, LoadingController } from '@ionic/angular';

@Injectable({providedIn:'root'})
export class AlertService{
    constructor(public alertController: AlertController,
                public loadingController: LoadingController,
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
        console.log(result)
    }
}