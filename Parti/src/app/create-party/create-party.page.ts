import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../providers/auth.service';
import { partiUser, partiGroup, parties } from '../../models/data.model';
import { AngularFireAuth } from '@angular/fire/auth';
import { GroupService } from '../../providers/group.service';
import * as moment from 'moment';
import { AlertService } from '../../providers/alert.service';
import { Events } from '@ionic/angular';
import { PartiService } from '../../providers/parti.service';
import { takeUntilNgDestroy } from 'take-until-ng-destroy';

@Component({
  selector: 'app-create-party',
  templateUrl: 'create-party.page.html',
  styleUrls: ['create-party.page.scss'],
})
export class CreatePartyPage implements OnDestroy {

	@ViewChild('signupSlider',{static:false}) signupSlider;

	partiForm: FormGroup;
    submitAttempt: boolean;
    minMoreThanMax:boolean;
    minArray: Array<number>;
    maxArray: Array<number>;
    groups:Array<any>;
    today = moment().format("YYYY-MM-DD");
    startDateSelected:boolean;
    startDate:string;
    hourArray: Array<number>;
    friendArray: Array<any>;
    user:partiUser;
    uid = this.afAuth.auth.currentUser.uid;
    constructor(
        public formBuilder: FormBuilder,
        public router: Router,
        private alertService : AlertService,
        private authService: AuthService,
        private groupService: GroupService,
        private events: Events,
        private partiService:PartiService,
        private afAuth:AngularFireAuth
        ) {
            this.groups = [];
            this.submitAttempt = false;
            this.startDateSelected = false;
            console.log(this.today);
            this.groupService.getGroups().pipe(takeUntilNgDestroy(this)).subscribe(data=>{
                if(data && data.length){
                    this.groups=data;
                }
            });
            this.authService.getUserData().pipe(takeUntilNgDestroy(this)).subscribe(data=>{
                if(data){
                    this.user = data;
                    this.friendArray = data.friends;
                }
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
            this.partiForm.valueChanges.pipe(takeUntilNgDestroy(this)).subscribe(data=>{
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
        let pendingMembers:Array<any> = this.partiForm.get('friends').value;
        const startDate = new Date(this.partiForm.get('partiStart').value);
        const hoursBeforeStartToExp = this.partiForm.get('partiExpire').value;
        let expdate = new Date(this.partiForm.get('partiStart').value);
        expdate.setHours(expdate.getHours()-Number(hoursBeforeStartToExp));
        
        this.submitAttempt = true;

        if(!this.minMoreThanMax && this.partiForm.valid){
            if(!pendingMembers){
                pendingMembers=[];
            }

            let groupNames:Array<string> = [];
            let groupIds:Array<string> = [];

            if(groups){
                groups.forEach(group=>{
                    groupNames.push(group.groupName);
                    groupIds.push(group.groupId);
                    group.members.forEach(member=>{
                        if(member.uid != this.uid){
                            pendingMembers.push(member);
                        }
                    });                    
                });
            }

            pendingMembers = pendingMembers.filter((obj, index, self) => self.findIndex(t => t.uid === obj.uid) === index); //remove duplicate friends
            
            let friendIds:Array<string> = [];

            pendingMembers.forEach(friend=>{
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
                pendingMembers:pendingMembers,
                pendingMemberIds: friendIds,
                time: startDate,
                exptime: expdate,
                place: location,
                memberCount: 1,
                pendingMemberCount: pendingMembers.length,
                members: [currUser],
                memberIds: [currUser.uid],
                isFull:false,
                isExpired:false
            }             
            this.startParti(partiCreated);
            
        }else{
            console.log('failed');
        }
    }
    startParti(parti:parties){
        this.alertService.createPartiAlert();
        this.events.subscribe('parti:start',()=>{
            this.partiService.createParty(parti);
        });
    }
    logGroups(){
        console.log(this.groups);
    }
    ngOnDestroy(){

    }

}