import { Component, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../providers/auth.service';
import { partiUser, partiGroup, parties } from '../../models/user.model';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { GroupService } from '../../providers/group.service';
import * as moment from 'moment';
import { AlertService } from '../../providers/alert.service';
import { Events } from '@ionic/angular';
import { partiService } from '../../providers/parti.service';

@Component({
  selector: 'app-create-party',
  templateUrl: 'create-party.page.html',
  styleUrls: ['create-party.page.scss'],
})
export class CreatePartyPage implements OnInit {

	@ViewChild('signupSlider',{static:false}) signupSlider;

	private partiForm: FormGroup;
    private submitAttempt: boolean = false;
    private minMoreThanMax:boolean;
    private minArray: Array<number>;
    private maxArray: Array<number>;
    private groups:any=[];
    private today = moment().format("YYYY-MM-DD");
    private startDateSelected:boolean = false;
    private startDate:string;
    private hourArray: Array<number>;
    private friendArray: Array<any>;
    private user:partiUser;
    uid = this.afAuth.auth.currentUser.uid;
    constructor(
        public formBuilder: FormBuilder,
        public router: Router,
        private alertService : AlertService,
        private authService: AuthService,
        private groupService: GroupService,
        private events: Events,
        private partiService:partiService,
        private afAuth:AngularFireAuth
        ) {
            console.log(this.today);
            this.groupService.groups$.subscribe(data=>{
                this.groups=data;
            });
            this.authService.user$.subscribe(data=>{
                this.user = data;
                this.friendArray = data.friends;
            })
            this.minArray = this.rangeMembers(9);
            this.maxArray = this.rangeMembers(20);
            this.hourArray = this.rangeTime(24);
            this.partiForm = formBuilder.group({
                partiName: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
                partiType: ['', Validators.required],
                partiStart: ['', Validators.required],
                partiExpire: [''],
                location: ['', Validators.required],
                minMembers: [2],
                maxMembers: ['unlimited'],
                groups: [''],
                friends:['']
            });
            this.partiForm.valueChanges.subscribe(data=>{
                if(data){
                    if(data.partiStart){
                        this.startDate = data.partiStart;
                        this.startDateSelected = true;
                    }else{
                        this.startDateSelected = false;
                    }

                    if(data.maxMembers){
                        if (data.maxMembers=="unlimited"){
                            this.minMoreThanMax=false;
                        }
                        else if(data.maxMembers < data.minMembers){
                            this.minMoreThanMax=true;
                        }
                        else{
                            this.minMoreThanMax=false;
                        }
                    }

                    if(data.minMembers){
                        if(data.minMembers > data.maxMembers){
                            this.minMoreThanMax=true;
                        }
                        else{
                            this.minMoreThanMax=false;
                        }
                    }
                }
            });
    }

    rangeMembers = (N) => Array.from({length: N}, (v, k) => k+2);
    rangeTime = (N) => Array.from({length: N}, (v, k) => k+1);

    prev(){
        this.signupSlider.slidePrev();
    }

    save(){

        this.submitAttempt = true;
        if(this.partiForm.valid) {
            console.log("success!")
            console.log(this.partiForm.value);
        }

    }
    backToParties(){
        this.router.navigate(['/tabs/parties']);
    }
    submitParti(){
        const name = this.partiForm.get('partiName').value;
        const type = this.partiForm.get('partiType').value;
        const location = this.partiForm.get('location').value;
        const minMembers = this.partiForm.get('minMembers').value;
        const maxMembers = this.partiForm.get('maxMembers').value;
        const groups:Array<partiGroup> = this.partiForm.get('groups').value;
        let friends:Array<any> = this.partiForm.get('friends').value;
        const startDate = new Date(this.partiForm.get('partiStart').value);
        const hoursBeforeStartToExp = this.partiForm.get('partiExpire').value;
        const expdate = new Date(this.partiForm.get('partiStart').value);
        expdate.setHours(expdate.getHours()-hoursBeforeStartToExp);
        
        this.submitAttempt = true;

        if(!this.minMoreThanMax && this.partiForm.valid){
            if(!friends){
                friends=[];
            }

            let groupNames:Array<string> = [];
            let groupIds:Array<string> = [];

            if(groups){
                groups.forEach(group=>{
                    groupNames.push(group.groupName);
                    groupIds.push(group.groupId);
                    group.members.forEach(member=>{
                        if(member.uid != this.uid){
                            friends.push(member);
                        }
                    });
                });
            }

            friends = friends.filter((obj, index, self) => self.findIndex(t => t.uid === obj.uid) === index);
            
            let friendIds:Array<string> = [];

            friends.forEach(friend=>{
                friendIds.push(friend.uid);
            })

            let currUser = {
                displayName : this.user.displayName,
                email: this.user.email,
                uid: this.user.uid
              }

            const partiCreated: parties = {
                partyId:'',
                partyName: name,
                partyType: type,
                partyLeader: currUser,
                minMembers: minMembers,
                maxMembers: maxMembers,
                groupNames: groupNames,
                groupIds: groupIds,
                pendingMembers:friends,
                pendingMemberIds: friendIds,
                time: startDate,
                exptime: expdate,
                place: location,
                memberCount: 1,
                pendingMemberCount: friends.length,
                members: [currUser],
                memberIds: [currUser.uid]
            } 

            console.log("success!");
            this.startParti(partiCreated);
            
        }else{
            console.log('failed');
        }
    }
    ngOnInit(){

    }
    startParti(parti:parties){
        this.alertService.createPartiAlert();
        this.events.subscribe('parti:start',()=>{
            this.partiService.createParty(parti);
        });
    }

}