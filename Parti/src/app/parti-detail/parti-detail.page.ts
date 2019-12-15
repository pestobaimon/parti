import { Component, OnInit } from '@angular/core';
import { partiGroup, partiUser, parties } from 'src/models/user.model';
import { PartiService } from 'src/providers/parti.service';
import { AngularFirestore } from '@angular/fire/firestore';
import * as moment from 'moment';


@Component({
  selector: 'app-parti-detail',
  templateUrl: './parti-detail.page.html',
  styleUrls: ['./parti-detail.page.scss'],
})
export class PartiDetailPage implements OnInit {
  group:partiGroup;
  user:partiUser;
  partiID:string = this.partiService.partiIDtoshow;
  partiToView:parties;
  members:Array<any>;
  pending:Array<any>;
  percentage:number;
  setProgressBar:string;

  constructor(
    private partiService: PartiService,
    private afs: AngularFirestore,
  ) { 
    console.log(this.partiID);
    this.afs.collection("parties").doc<parties>(this.partiID)
    .valueChanges()
    .subscribe(party=>{
      this.partiToView = party;
      
      this.members= party.members;
      
      this.pending = party.pendingMembers;
      
      this.percentage = (party.memberCount / party.maxMembers)*100;

      this.setProgressBar = "progress-bar p-" + this.percentage;
      console.log(this.setProgressBar);
    });
  }
  
  ngOnInit() {
    var $progressBar = $('.progress-bar');
    setInterval(function() {
        var newPercentage = Math.round(Math.random() * 100);
        $progressBar 
            .removeClass(this.findProgressPercentageClasses)
            .addClass('p-' + 20);
    }, 1000);
  }
  convertTimeStamp(timestamp:any){
    const time = Number(timestamp.seconds);
    return moment.unix(time).format('DD/MM/YYYY');
  }

  findProgressPercentageClasses(index, css) {
    return (css.match(/p-.*/) || []).join(' ');
}
}
