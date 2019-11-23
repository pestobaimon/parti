import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { partiUser } from '../models/user.model'
import { Observable, of, BehaviorSubject } from 'rxjs';
import { switchMap, take } from 'rxjs/operators'
import { Router } from '@angular/router';
import { AlertService } from './alert.service';

@Injectable({providedIn: 'root'})
export class AuthService {
    constructor(
        private afAuth : AngularFireAuth,
        private afs: AngularFirestore,
        private router: Router,
        private alertService: AlertService

    ){
        this.user$ = this.afAuth.authState.pipe(
            switchMap(user => {
                if (user){
                    return this.afs.doc<partiUser>(`users/${user.uid}`).valueChanges();
                }else{
                    return of(null);
                }
            })
        );
        this.afAuth.authState.pipe(take(1)).subscribe(user =>{
            if(user){
                const userRef: AngularFirestoreDocument<any> = this.afs.doc(
                    `users/${user.uid}`
                );
                userRef.ref.get().then(value => {
                    if(value.exists){
                        const data : partiUser = {
                            uid: user.uid,
                            email: user.email,
                            displayName: value.get('displayName'),
                            friends: value.get('friends'),
                            groups: value.get('groups')
                        };
                    }else{
                        const data : partiUser = {
                            uid: user.uid,
                            email: user.email,
                            displayName: user.displayName,
                            friends: [],
                            groups: []
                        };
                        this.setUserData(data).catch(error =>{
                            console.log(error);
                            router.navigate(['/user-creation']);
                        });
                    }
                });
            }   
        });
    }
    authState = new BehaviorSubject(false);
    
    user$: Observable<partiUser>;
    public setUserData(user: partiUser) {
        return this.afs.doc<partiUser>(`users/${user.uid}`).set(user);
      }
    
    private updateUserData(user: partiUser) {
        return this.afs.doc<partiUser>(`users/${user.uid}`).update(user);
      }
    
    updateDisplayName(name:string){
        this.afAuth.authState.pipe(take(1)).subscribe(user =>{
            if(user){
                const userRef: AngularFirestoreDocument<any> = this.afs.doc(
                    `users/${user.uid}`
                );
                userRef.update({"displayName":name});
                this.alertService.inputAlert('Display name changed!');
            }
        });
    }
    login(){

    }

    logout(){
        
    }

}