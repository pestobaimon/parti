import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { partiUser } from '../models/user.model'
import { Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators'
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class AuthService {
    constructor(
        private afAuth : AngularFireAuth,
        private afs: AngularFirestore,
        private router: Router

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
                            displayName: user.displayName
                        };
                        const uid = user.uid;
                        const updatedUser = {uid, ...value.data()};
                        this.updateUserData(updatedUser).catch(error => {
                            console.log(error);
                            router.navigate(['/login']);
                        });
                    }else{
                        const data : partiUser = {
                            uid: user.uid,
                            email: user.email,
                            displayName: user.displayName
                        };
                        this.setUserData(data).catch(error =>{
                            console.log(error);
                            router.navigate(['/login']);
                        });
                    }
                });
            }   
        });
    }
    user$: Observable<partiUser>;
    public setUserData(user: partiUser) {
        return this.afs.doc<partiUser>(`users/${user.uid}`).set(user);
      }
    
    private updateUserData(user: partiUser) {
        return this.afs.doc<partiUser>(`users/${user.uid}`).update(user);
      }

    
}