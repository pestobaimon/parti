import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { partiUser } from '../models/user.model'
import { Observable, of, BehaviorSubject } from 'rxjs';
import { switchMap, take } from 'rxjs/operators'
import { AlertService } from './alert.service';

@Injectable({providedIn: 'root'})
export class AuthService {
    constructor( /**run everytime when create new instant(one instant per user) */
        private afAuth : AngularFireAuth,
        private afs: AngularFirestore,   /**read write database */     
        private alertService: AlertService

    ){
        this.user$ = this.afAuth.authState.pipe(    
            switchMap(user => { /**run newest data */
                if (user){
                    return this.afs.doc<partiUser>(`users/${user.uid}`).valueChanges(); /**ja emit when valuechange, return observable of document with document id as logged in uid */
                }else{ /**aow other data tee pen obseravable kong uid nee ma display */
                    return of(null);
                }
            })
        );
        this.afAuth.authState.pipe(take(1)).subscribe(user =>{ /**pen new user or not */
            if(user){ 
                const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
                userRef.ref.get().then(value => { /**get=aow data at that time, then=promise wa ja tum arai */
                    if(value.exists){
                        console.log('user already exists, no data added');
                    }else{
                        const data : partiUser = {
                            uid: user.uid,
                            email: user.email.toLowerCase(),
                            displayName: user.displayName,
                            friends: [],
                        };
                        this.setUserData(data).catch(error =>{
                            console.log(error);
                        });
                    }
                });
            }   
        });
    }
    authState = new BehaviorSubject(false);
    
    user$: Observable<partiUser>; /**variable type is obs emit partiUser type */
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