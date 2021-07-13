import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable, of } from 'rxjs';
import { tap, finalize, take, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class FirebaseStorageService {
  task: AngularFireUploadTask;
  doc: AngularFirestoreDocument;
  constructor(private afs: AngularFirestore,
    private storage: AngularFireStorage) { }
  pushFileToStorage(basePath: string, id: string, file: File, defaultImage?: boolean): Observable<number> {
    let downloadURL = '';
    let docRef = '';
    // storage path
    const storagePath = basePath + `/${id}/${Date.now()}_${file.name}`;

    //reference to storage bucket
    const storageRef = this.storage.ref(storagePath);

    //main task
    this.task = this.storage.upload(storagePath, file);

    //progress monitoring
    const percentage = this.task.percentageChanges();

    this.task.snapshotChanges().pipe(
      tap(t => t),
      finalize(async () => {
        downloadURL = await storageRef.getDownloadURL().toPromise();
        let data = defaultImage ? { downloadURL, storagePath, productId: id, defaultImage }
          : { downloadURL, storagePath, productId: id }
        this.afs.collection(basePath).add(data);
      })
    ).subscribe()
    return percentage ;
  }

  async getList(basePath: string, productId: string): Promise<any[]> {
    let imageUrls: string[] = [];
    const storagePath = basePath + `/${productId}`;
    const storageRef = this.storage.ref(storagePath)
    storageRef.listAll().subscribe((snap) => {
      snap.items.forEach((imageRef) => {
        imageRef.getDownloadURL().then(imageUrl => {
          imageUrls.push(imageUrl);
        });
      });
    })
    return imageUrls;
  }
  getUrlByStoragePath(storagePath: string): Observable<any> {
    const storageRef = this.storage.ref(storagePath);
    return storageRef.getDownloadURL();
  }
  getStorageDocument(collectionRef: string, productId: string) {
    return this.afs.collection(collectionRef, ref => ref.where('productId', '==', productId)
      .where('defaultImage', '==', true).limit(1)).valueChanges({idField: 'id'});
  }
  deleteByStoragePath(storagePath: string){
    const storageRef = this.storage.ref(storagePath);
    return storageRef.delete();
  }

}
