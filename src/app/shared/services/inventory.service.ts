import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage , AngularFireUploadTask} from '@angular/fire/storage';
import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;

import { Observable } from 'rxjs';
import { finalize, map, take, tap } from 'rxjs/operators';
import { Product } from '../models/product';
import { AuthService } from './auth.service';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  collection: AngularFirestoreCollection<Product>;
  doc: AngularFirestoreDocument<Product>;
  task: AngularFireUploadTask;
  lastProduct: Product;
  constructor(private afs: AngularFirestore,
    private storage: AngularFireStorage,
    private sessionService: SessionService) {
    this.collection = this.afs.collection('products');
  }
  inquiry(): Observable<Product[]> {
    return this.collection.valueChanges({ idField: 'id' });
  }
  create(data: Product) {
    data.createdOn = this.getfirebaseCurrentTimeStamp();
    data.createdBy = this.sessionService.getLoginUser().emailId || '';
    let item = data;
    delete item.id;
    let docRef = this.collection.add(item)
    return docRef;
  }
  update(data: Product) {
    this.doc = this.afs.doc(`products/${data.id}`);
    return this.doc.update({
      code: data.code,
      name: data.name,
      currency: data.currency,
      price: data.price,
      ratings: data.ratings,
      seller: data.seller,
      category: data.category,
      stockQuantity: data.stockQuantity,
      modifiedOn: this.getfirebaseCurrentTimeStamp(),
      modifiedBy: this.sessionService.getLoginUser().emailId || ''
    });
  }
  delete(id: string) {
    this.doc = this.afs.doc<Product>(`products/${id}`);
    return this.doc.delete();
  }
  get(id: string) {
    return this.afs.doc<Product>(`products/${id}`).valueChanges();
  }
  getByCategory(category: string) {
    return this.afs.collection<Product>('products', ref => ref.where('category', 'in', category)).valueChanges({ idField: 'id' })
  }
  getBySeller(seller: string) {
    return this.afs.collection<Product>('products', ref => ref.where('seller', 'in', seller)).valueChanges({ idField: 'id' })
  }
  getLikeCategory(category: string) {
    return this.afs.collection<Product>('products', ref => ref.where('category', '>=', category).where('category', '<=', category + '\uf8ff')).valueChanges({ idField: 'id' });
  }

  getDownloadURL(id: string) {
    const fileRef = `products/${id}/${id}`
    const storageRef = this.storage.ref(fileRef);
    return storageRef.getDownloadURL();
  }
  getfirebaseCurrentTimeStamp(): Date {
    return new Date(firebase.firestore.Timestamp.now().seconds * 1000)
  }
  pushFileToStorage(basePath: string, file:File, id: string): Observable<number>{
    let downloadURL = '';
    const storagePath = `${basePath}/${id}/${id}`;
    const storageRef = this.storage.ref(storagePath);
    this.task  = this.storage.upload(storagePath, file);
    const percentage = this.task.percentageChanges()
    this.task.snapshotChanges().pipe(
      finalize(async ()=>{
        downloadURL = await storageRef.getDownloadURL().toPromise();
        this.collection.doc(id).update({
          url: downloadURL
        })
      })
    ).subscribe();
    return percentage;
  }
  removeFileFromStorage(id: string, downloadURL: string){
    const task = this.storage.refFromURL(downloadURL).delete();
    return task.pipe(
      tap(t => t),
      finalize(()=>{
        const productRef = this.afs.doc(`products/${id}`);
        productRef.update({
          url: firebase.firestore.FieldValue.delete()
        })
      })

    )
  }

}
