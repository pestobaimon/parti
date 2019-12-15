import { Injectable } from "@angular/core";
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({providedIn: 'root'})
export class PhotoService {
    constructor(
        private camera : Camera,
        private storage : AngularFireStorage,
        private afAuth : AngularFireAuth,
        private afs : AngularFirestore
    ){}
    private optionsCamera: CameraOptions = {
        quality: 100,
        targetWidth: 600,
        sourceType: this.camera.PictureSourceType.CAMERA,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
    }
    currUid = this.afAuth.auth.currentUser.uid;
     // Main task 
    task: AngularFireUploadTask;

    // Progress monitoring
    percentage: Observable<number>;

    snapshot: Observable<any>;

    // Download URL
    downloadURL: Observable<string>;

    private optionsGallery: CameraOptions = {
    quality: 100,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
    }
    getFromCamera(){
        this.camera.getPicture(this.optionsCamera).then( imageData =>{
            let base64Image = 'data:image/jpeg;base64,' + imageData;
            this.startUpload(base64Image);
        }), (err) => {
            console.log(err);
        }
    }
    getFromGallery(){
        this.camera.getPicture(this.optionsGallery).then( imageData =>{
            let base64Image = 'data:image/jpeg;base64,' + imageData;
            this.startUpload(base64Image);
        }), (err) => {
            console.log(err);
        }
    }
    startUpload(base64Image:string) {
        // The File object
        const file = base64Image;
        console.log(file);
        
        // The storage path
        const path = `user_profile_pictures/${this.currUid}/${new Date().getTime()}_${this.currUid}`;

        // The storage Ref
        const ref = this.storage.ref(path);
    
        // Totally optional metadata
        const customMetadata = { app: 'My AngularFire-powered PWA!' };
    
        // The main task
        this.task = ref.putString(base64Image,'data_url');
    
        // Progress monitoring
        this.percentage = this.task.percentageChanges();
        this.snapshot   = this.task.snapshotChanges()
    
        // The file's download URL
        this.task.snapshotChanges().pipe(
            finalize(() => {
                this.downloadURL = ref.getDownloadURL();
                this.downloadURL.subscribe(url=>{
                    this.afs.collection('users').doc(this.currUid).update({profilePic : url}).then(()=>{
                        console.log('upload success');
                    })
                })
            } )
        )
        .subscribe()
    }
      
}