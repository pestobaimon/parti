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
  percentage:string = "0%";
  minpercent:string = "0%";
  leftover: string = "0%";
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
      
      this.members= party.members;
      
      this.pending = party.pendingMembers;
      

      this.percentage = party.memberCount/party.maxMembers*100 + "%";
      console.log(this.percentage);
      this.minpercent = (party.minMembers/party.maxMembers*100) + "%";
      console.log(this.minpercent);
      this.leftover = ((party.maxMembers/party.maxMembers*100)-(party.minMembers/party.maxMembers*100)) + "%";
      console.log(this.leftover)
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
