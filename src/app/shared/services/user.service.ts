import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore'
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { UserAccount } from '../models/user-account';
import { finalize, map, take, tap } from 'rxjs/operators';
import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  collection: AngularFirestoreCollection<UserAccount>;
  doc: AngularFirestoreDocument<UserAccount>;
  userAccounts: Observable<UserAccount[]>;
  userAccount: Observable<UserAccount>;
  task: AngularFireUploadTask;
  constructor(private afs: AngularFirestore,
    private storage: AngularFireStorage) {
    this.collection = this.afs.collection<UserAccount>('users')
  }
  inquiry(): Observable<UserAccount[]> {
    return this.collection.valueChanges({ idField: 'id' })
  }
  create(data: UserAccount) {
    //const id = this.afs.createId();
    return this.collection.doc(data.id).set(data);
  }
  update(data: UserAccount) {
    this.doc = this.afs.doc<UserAccount>('users/' + data.id);
    return this.doc.update(data);
  }
  delete(id: string) {
    this.doc = this.afs.doc<UserAccount>('users/' + id);
    return this.doc.delete();
  }
  get(id: string) {
    this.doc = this.afs.doc<UserAccount>('users/' + id);
    return this.doc.valueChanges()
  }
  pushFileToStorage(uploadPath: string, id: string, file: File): Observable<number> {
    const storagePath = `${uploadPath}/${id}`;
    const storageRef = this.storage.ref(storagePath);
    this.task = this.storage.upload(storagePath, file)
    const percentage = this.task.percentageChanges();
    this.task.snapshotChanges().pipe(
      tap(t => t),
      finalize(async () => {
        const downloadURL = await storageRef.getDownloadURL().toPromise();
        const userRef = this.afs.doc('users/' + id);
        userRef.update({url: downloadURL})
      })
    ).subscribe();
      return percentage;
  }
  getDownloadURL(id: string) {
    const fileRef = 'users/' + id;
    const storeRef = this.storage.storage.ref().child(fileRef);
    return storeRef.getDownloadURL();
  }
  getUserAccountByEmail(emailId: string) {
    return this.userAccounts = this.afs.collection<UserAccount>('users', ref => ref.where('emailId', '==', emailId)
      .limit(1)).valueChanges({ idField: 'id' })
  }
  removeFileFromStorage(id: string, downloadURL: string){
    const task = this.storage.refFromURL(downloadURL).delete();
    return task.pipe(
      tap(t => t),
      finalize(()=>{
        const userRef = this.afs.doc(`users/${id}`);
        userRef.update({url: firebase.firestore.FieldValue.delete()})
      })
    );

  }

}
