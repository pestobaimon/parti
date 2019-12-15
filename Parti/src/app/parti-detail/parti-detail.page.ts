import { Component } from '@angular/core';
import { partiGroup, partiUser, parties } from 'src/models/user.model';
import { PartiService } from 'src/providers/parti.service';
import { AngularFirestore } from '@angular/fire/firestore';
import * as moment from 'moment';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-parti-detail',
  templateUrl: './parti-detail.page.html',
  styleUrls: ['./parti-detail.page.scss'],
})
export class PartiDetailPage {
  group:partiGroup;
  user:partiUser;
  partiID:string = this.partiService.partiIDtoshow;
  partiToView:parties;
  members:Array<any>;
  pending:Array<any>;

  constructor(
    private partiService: PartiService,
    private afs: AngularFirestore,
    private navCtrl: NavController
  ) { 
    console.log(this.partiID);
    this.afs.collection("parties").doc<parties>(this.partiID)
    .valueChanges()
    .subscribe(party=>{
      this.partiToView = party;
      console.log(this.partiToView);
      this.members= party.members;
      console.log(this.members);
      this.pending = party.pendingMembers;
      console.log(this.pending);
    })
  }
  goBack(){
    this.navCtrl.back();
  }
  
  convertTimeStamp(timestamp:any){
    const time = Number(timestamp.seconds);
    return moment.unix(time).format('DD/MM/YYYY');
  }
  back(){

  }
}
