import { Component, OnDestroy } from '@angular/core';
import { partiGroup, partiUser, parties } from 'src/models/data.model';
import { PartiService } from 'src/providers/parti.service';
import { AngularFirestore } from '@angular/fire/firestore';
import * as moment from 'moment';
import { NavController } from '@ionic/angular';
import { takeUntil } from 'rxjs/operators';
import { takeUntilNgDestroy } from 'take-until-ng-destroy';


@Component({
  selector: 'app-parti-detail',
  templateUrl: './parti-detail.page.html',
  styleUrls: ['./parti-detail.page.scss'],
})
export class PartiDetailPage implements OnDestroy {
  group:partiGroup;
  user:partiUser;
  partiID:string = this.partiService.partiIDtoshow;
  partiToView:parties;
  members:Array<any>;
  pending:Array<any>;
  percentage:string = "0%";
  minpercent:string = "0%";
  leftover: string = "0%";
  condition: boolean;
  condition2: boolean;
  constructor(
    private partiService: PartiService,
    private afs: AngularFirestore,
    private navCtrl: NavController
  ) { 
    console.log(this.partiID);
    this.afs.collection("parties").doc<parties>(this.partiID)
    .valueChanges()
    .pipe(takeUntilNgDestroy(this))
    .subscribe(party=>{
      this.partiToView = party;
      this.members= party.members;
      this.pending = party.pendingMembers;
      this.condition = party.memberCount < party.minMembers && party.maxMembers == "unlimited";
      this.condition2 = party.memberCount >= party.minMembers && party.maxMembers == "unlimited";
      if(party.maxMembers === 'unlimited'){
        this.minpercent = "100%"
        console.log(this.minpercent);
        this.leftover = "0%";
        console.log(this.leftover);
        this.percentage = ((party.memberCount/party.minMembers)*100) + "%";
        console.log(this.percentage);
      }else{
        this.minpercent = ((party.minMembers/party.maxMembers)*100) + "%";
        console.log(this.minpercent);
        this.leftover = ((party.maxMembers/party.maxMembers*100)-(party.minMembers/party.maxMembers*100)) + "%";
        console.log(this.leftover)
        this.percentage = party.memberCount/party.maxMembers*100 + "%";
        console.log(this.percentage);
      }
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
  ngOnDestroy(){
    
  }
}
